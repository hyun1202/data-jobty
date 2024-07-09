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

    if (createMenuDto.menu_type === MenuType.MAIN && createMenuDto.category_id) {
      mainCategory = await this.findMenuCategory(createMenuDto.category_id);
    }
    const menu = this.createMenu(createMenuDto, mainCategory,domain);
    return new MenuResDto(await this.menuRepository.save(menu));
  }

  /**
   * 메뉴 전체 조회
   * @param doamin 도메인
   * @param userId 유저 아이디
   */
  async findMenus(doamin: string, userId: string) {
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
    const menuCategory = await this.findMenuCategory(updateMenuDto.category_id);
    menu.updateMenu(menuCategory, updateMenuDto);

    return new MenuResDto(await this.menuRepository.save(menu));
  }

  /**
   * 다건 메뉴 수정
   * @param domain 도메인
   * @param userId 유저 아이디
   * @param updateAllMenuDto 수정할 메뉴들 정보
   */
  async allCreateAndUpdateAndRemove(domain: string, userId: string, updateMenuDtos: UpdateMenuDto[]) {
    //TODO 트랜잭션 처리 필요, 리팩토링 필요, 에러시 어떤 메뉴에서 에러났는지 정보 추가
    const oriMenus: Menu[]  = await this.menuRepository.findMenuOrderById(domain, userId);
    const menuCategorys: BlogMenuCategory[] = await this.blogMenuCategoryRepository.findBy({
      type: MenuType.MAIN
    });

    const updatedMenus= updateMenuDtos.map(updateMenuDto => {
      const mainCategory = menuCategorys.find(mc => mc.id === updateMenuDto.category_id);
      let menu = oriMenus.find(m => m.id === updateMenuDto.menu_id);
      if (!menu) {
       if (updateMenuDto.edit_type === MenuUpdateType.CREATE) {
         menu = this.createMenu(updateDtoToCreateDto(updateMenuDto), mainCategory, domain);
         return menu;
       } else {
         throw new CustomException(toErrorcodeById(ErrorCode.FAILED_MENU_CREATED, updateMenuDto.menu_id));
       }
      }
      menu.updateMenu(mainCategory, updateMenuDto);

      return menu;
    });

    const removeMenuIds = updateMenuDtos
      .filter(menu => menu.edit_type === MenuUpdateType.REMOVE)
      .map(menu => menu.menu_id);

    await this.menuRepository.saveMenus(
      await Promise.all(updatedMenus),
      removeMenuIds
    );

    return await this.findMenus(domain, userId);
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

  private createMenu(createMenuDto: CreateMenuDto, mainCategory: BlogMenuCategory, domain: string) {
    const menu: Menu = Builder(Menu)
      .menuName(createMenuDto.menu_name)
      .sortNo(createMenuDto.sort_no)
      .groupNo(createMenuDto.group_no)
      .build();

    menu.createMenu(domain, createMenuDto.menu_type, mainCategory, createMenuDto.upper_menu_id);
    return menu;
  }
}
