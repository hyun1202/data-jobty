import { Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/request/create-menu.dto";
import { UpdateMenuDto } from "./dto/request/update-menu.dto";
import { MenuRepository } from "./menu.repository";
import { Menu } from "./entities/menu.entity";
import { Builder } from "builder-pattern";
import { BlogMenuCategoryRepository } from "./blog-menu-category.repository";
import { BlogMenuCategory } from "./entities/blog-menu-category.entity";
import { CustomException } from "../../common/exception/custom.exception";
import { ErrorCode, toErrorcodeById } from "../../common/exception/error.code";
import { MenuResDto } from "./dto/response/menu-res.dto";
import { MenuType } from "./entities/menu-type";
import { UpdateAllMenuDto } from "./dto/request/update-all-menu.dto";
import { MenuUpdateType } from "./entities/menu-update-type";
import { updateDtoToCreateDto } from "./dto/menu.mapper";

@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository,
              private readonly blogMenuCategoryRepository: BlogMenuCategoryRepository) {
  }

  /**
   * 메뉴 생성
   * @param domain 도메인
   * @param createMenuDto 생성할 메뉴 정보
   */
  async create(domain: string, createMenuDto: CreateMenuDto) {
    let mainCategory: BlogMenuCategory = null;

    if (createMenuDto.category_id) {
      mainCategory = await this.findMenuCategory(createMenuDto.category_id);
    }

    const menu: Menu = Builder(Menu)
      .menuName(createMenuDto.menu_name)
      .sortNo(createMenuDto.sort_no)
      .groupNo(createMenuDto.group_no)
      .build();

    menu.createMenu(domain, createMenuDto.menu_type, mainCategory, createMenuDto.upper_menu_id);
    return new MenuResDto(await this.menuRepository.save(menu));
  }

  /**
   * 메뉴 전체 조회
   * @param doamin 도메인
   * @param userId 유저 아이디
   */
  async findAll(doamin: string, userId: string) {
    const menus = await this.menuRepository.findMenus(doamin, userId);
    // TODO 메뉴 조회 시 게시글 수도 조회해야 함 (entries)
    // 대메뉴에 소메뉴도 나오므로 filter처리
    return menus
      .filter(menu => menu.type != MenuType.SUB)
      .map(menu => new MenuResDto(menu));
  }

  /**
   * 메뉴 업데이트
   * @param domain 도메인
   * @param userId 유저 아이디
   * @param updateMenuDto 메뉴 업데이트 정보
   */
  async update(domain: string, userId: string, updateMenuDto: UpdateMenuDto) {
    // TODO 대메뉴 -> 소메뉴 업데이트 시, 카테고리 upper_menu_id가 사라지게됨 => [카테고리 없음]으로 설정
    const menu: Menu = await this.findMenu(updateMenuDto.menu_id, domain, userId);
    if (updateMenuDto.menu_type === MenuType.MAIN) {
      const menuCategory = await this.findMenuCategory(updateMenuDto.category_id);
      menu.updateMainMenu(menuCategory, updateMenuDto.menu_name, updateMenuDto.group_no);
    } else {
      menu.updateSubMenu(updateMenuDto.upper_menu_id, updateMenuDto.menu_name, updateMenuDto.menu_name, updateMenuDto.sort_no);
    }

    return new MenuResDto(await this.menuRepository.save(menu));
  }

  /**
   * 다건 메뉴 수정
   * @param domain 도메인
   * @param userId 유저 아이디
   * @param updateAllMenuDto 수정할 메뉴들 정보
   */
  async allCreateAndUpdateAndRemove(domain: string, userId: string, updateAllMenuDto: UpdateAllMenuDto) {
    //TODO 트랜잭션 처리 필요, 리팩토링 필요, 에러시 어떤 메뉴에서 에러났는지 정보 추가
    const tasks = updateAllMenuDto.menus.map(async menu => {
      switch (menu.edit_type) {
        case MenuUpdateType.CREATE:
          try {
            await this.create(domain, updateDtoToCreateDto(menu));
          }catch (e) {
            console.log(e);
            throw new CustomException(
              toErrorcodeById(ErrorCode.UPDATE_FAILED_CREATE_MENU, menu.menu_id)
            );
          }
          break;
        case MenuUpdateType.UPDATE:
          try {
            await this.update(domain, userId, menu);
          }catch (e) {
            console.log(e);
            throw new CustomException(
              toErrorcodeById(ErrorCode.UPDATE_FAILED_NO_MENU_DATA, menu.menu_id)
            );
          }
          break;
        case MenuUpdateType.REMOVE:
          try {
            await this.remove(menu.menu_id, domain, userId);
          }catch (e) {
            console.log(e);
            throw new CustomException(
              toErrorcodeById(ErrorCode.UPDATE_FAILED_REMOVE_MENU, menu.menu_id)
            );
          }
          break;
      }
    });

    await Promise.all(tasks);

    return await this.findAll(domain, userId);
    // return "성공했습니다.";
  }

  async remove(menuId: number, domain: string, userId: string) {
    // 하위 메뉴가 있으면 삭제 불가
    if (await this.menuRepository.existsUpperMenu(menuId, domain, userId)) {
      throw new CustomException(ErrorCode.EXISTS_LOWER_MENU);
    }

    const menu = await this.findMenu(menuId, domain, userId);
    await this.menuRepository.softRemove(menu);
  }

  async findMenu(menuId: number, domain: string, userId: string) {
    const menu: Menu = await this.menuRepository.findMenu(menuId, domain, userId);

    if (menu == null) {
      throw new CustomException(ErrorCode.NO_MENU_DATA);
    }
    return menu;
  }

  async findMenuCategory(menuCategoryId: number) : Promise<BlogMenuCategory> {
    const menuCategory: BlogMenuCategory = await this.blogMenuCategoryRepository.findOneBy({id: menuCategoryId})
    if (menuCategory == null) {
      throw new CustomException(ErrorCode.INCORRECT_MAIN_CATEGORY);
    }
    return menuCategory;
  }
}
