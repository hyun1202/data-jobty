import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";

@Injectable()
export class UsersRepository extends Repository<User>{
  constructor( private dataSource: DataSource ) {
    super(User, dataSource.createEntityManager());
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>{
    const {email, pwd, nickname} = authCredentialsDto;
    const user = this.create({email, pwd, nickname});
    await this.save(user);
  }
  async findAll() : Promise<User[]> {
    const allUser = await this.dataSource.manager.createQueryBuilder(User, "member")
      .getMany();
    return allUser;
  }
}
