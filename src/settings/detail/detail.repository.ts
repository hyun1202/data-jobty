import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Setting } from "./entities/detail.entity";
import { User } from "../../users/entities/user.entity";

@Injectable()
export class DetailRepository extends Repository<Setting>{
  constructor( private dataSource: DataSource ) {
    super(Setting, dataSource.createEntityManager());
  }

  async existsByMemberId(memberId: string): Promise<boolean> {
    return this.dataSource.manager
      .getRepository(Setting)
      .createQueryBuilder('setting')
      .innerJoin(User, 'user')
      .where(`user.member_id = '${memberId}'`)
      .getExists();
  }
}