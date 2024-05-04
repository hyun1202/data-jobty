import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository extends Repository<User>{
  constructor( private dataSource: DataSource ) {
    super(User, dataSource.createEntityManager());
  }
  async findAll() : Promise<User[]> {
    const allUser = await this.dataSource.manager.createQueryBuilder(User, "member")
      .getMany();
    return allUser;
  }
}