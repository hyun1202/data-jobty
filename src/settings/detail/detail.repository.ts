import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Setting } from "./entities/detail.entity";
import { User } from "../../users/entities/user.entity";

export const selectOptions = {
  One: 'one',
  Exists: 'exists',
} as const;

type DetailFindAllSelectOptions = (typeof selectOptions)[keyof typeof selectOptions];

interface DetailFindAllWhereOptions {
  domain?: string
  memberId?: string
}

export interface DetailFindAllOptions {
  where?: DetailFindAllWhereOptions
  select?: DetailFindAllSelectOptions
}

@Injectable()
export class DetailRepository extends Repository<Setting>{
  constructor( private dataSource: DataSource ) {
    super(Setting, dataSource.createEntityManager());
  }

  async findAll(options: DetailFindAllOptions) : Promise<boolean | Setting>{
    const { where, select } = options;
    const qb = this.dataSource.manager
      .getRepository(Setting)
      .createQueryBuilder('s')
      .innerJoin(User, 'u');

    if (where) {
      const { domain, memberId} = where;
      if (domain) {
        qb.andWhere('s.domain = :domain', { domain });
      }
      if (memberId) {
        qb.andWhere('u.member_id = :memberId', { memberId });
      }
    }

    if (select) {
      if (select === selectOptions.Exists) {
        return await qb.getExists();
      }
      if (select === selectOptions.One) {
        return await qb.getOne();
      }
    }

    return await qb.getOne();
  }
}