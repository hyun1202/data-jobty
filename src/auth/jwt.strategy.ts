import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersRepository } from "../users/users.repository";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../users/entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository
  ){
    super({
      secretOrKey: 'Jobty',
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
