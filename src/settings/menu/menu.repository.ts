import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Menu } from "./entities/menu.entity";

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

  async existsUpperMenu(upperMenuId: number, domain: string, userId: string) {
   return this.existsBy({upperMenuId: upperMenuId, setting: {domain: domain, user: {id: userId}}});
  }
}
