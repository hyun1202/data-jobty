import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersRepository } from "../users/users.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../users/entities/user.entity";
import * as process from "node:process";

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
      throw new UnauthorizedException();
    }
    return user;
  }
}
