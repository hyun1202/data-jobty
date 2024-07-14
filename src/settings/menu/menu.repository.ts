import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";
import { CustomException } from "../../common/exception/custom.exception";
import { ErrorCode, toErrorcodeById } from "../../common/exception/error.code";

@Injectable()
export class MenuRepository extends Repository<Menu>{
  constructor(private dataSource: DataSource) {
    super(Menu, dataSource.createEntityManager());
  }

  /**
   * 해당 도메인, 아이디의 메뉴 전체 조회
   * @param domain 도메인
   * @param userId 유저 아이디
   */
  async findMenus(domain: string, userId: string) {
    return await this.dataSource.manager
      .getRepository(Menu)
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.subs', 'sub')
      .leftJoinAndSelect('m.menuCategory', 'c')
      .innerJoin('m.setting', 's')
      .where('s.domain = :domain', {domain})
      .andWhere('s.user_id = :id', {id: userId})
      .getMany();
  }

  /**
   * 메뉴 단건 조회
   * @param menuId 메뉴 아이디
   * @param domain 도메인
   * @param userId 유저 아이디
   */
  async findMenu(menuId: number, domain: string, userId: string) {
    return await this.findOneBy({
      id: menuId,
      setting: {
        domain: domain,
        user: {id: userId}
      }
    });
  }

  /**
   * 상위 메뉴 존재 여부 조회
   * @param upperMenuId 상위 메뉴 아이디
   * @param domain 도메인
   * @param userId 유저 아이디
   */
  async existsUpperMenu(upperMenuId: number, domain: string, userId: string) {
   return this.existsBy({upperMenuId: upperMenuId, setting: {domain: domain, user: {id: userId}}});
  }

  /**
   * 메뉴를 저장한다.
   * 메뉴 update 시 데이터베이스 관련 오류가 발생하면 롤백한다. (트랜잭션 설정)
   *
   * @param saveItem 저장할 메뉴
   * @param deleteId 삭제할 메뉴 아이디
   */
  async saveMenus(saveItem: any[], deleteId: any[]) {
    await this.dataSource.transaction(async manager => {
      try {
        await manager.save(saveItem);
        if (deleteId.length > 0) {
          await manager.softDelete(Menu, deleteId);
        }
      } catch (e) {
        console.log(e);
        throw new CustomException(toErrorcodeById(ErrorCode.FAILED_MENU_UPDATED_OR_REMOVED));
      }
    });
  }

  /**
   * 메뉴 단건 조회
   * @param domain 도메인
   * @param userId 유저 아이디
   */
  async findMenuOrderById(domain: string, userId: string): Promise<Menu[]>{
    return await this.find({
      where: {
        setting: {
          domain: domain,
          user: {id: userId}
        }
      },
      order: {
        id: "ASC"
      }
    });
  }
}
