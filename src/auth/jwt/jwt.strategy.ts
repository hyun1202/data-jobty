import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersRepository } from "../../users/users.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../users/entities/user.entity";
import * as process from "node:process";
import { CustomException } from "../../common/exception/custom.exception";
import { ErrorCode } from "../../common/exception/error.code";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository
  ){
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    })
  }

  async validate(payload) {
    const {email} = payload;
    const user: User = await this.usersRepository.findOneBy({email:email});
    if (!user) {
      throw new CustomException(ErrorCode.OPERATION_NOT_AUTHORIZED);
    }
    return user;
  }
}
