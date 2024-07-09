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

  async findMenu(menuId: number, domain: string, userId: string) {
    return await this.findOneBy({
      id: menuId,
      setting: {
        domain: domain,
        user: {id: userId}
      }
    });
  }

  async existsUpperMenu(upperMenuId: number, domain: string, userId: string) {
   return this.existsBy({upperMenuId: upperMenuId, setting: {domain: domain, user: {id: userId}}});
  }

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
