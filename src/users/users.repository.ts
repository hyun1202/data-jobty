import { User } from "./entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { AuthCredentialsDto } from "../auth/dto/auth-credentials.dto";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository extends Repository<User>{
  constructor( private dataSource: DataSource ) {
    super(User, dataSource.createEntityManager());
  }

async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void>{
  const {email, pwd, nickname} = authCredentialsDto;
  const salt = await bcrypt.genSalt();
  const hashedPwd = await bcrypt.hash(pwd , salt);

    const user = this.create({email, pwd: hashedPwd, nickname});
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('존재하는유저');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async findAll() : Promise<User[]> {
    const allUser = await this.dataSource.manager.createQueryBuilder(User, "member")
      .getMany();
    return allUser;
  }
}
