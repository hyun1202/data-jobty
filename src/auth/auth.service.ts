import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "../users/users.repository";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto : AuthCredentialsDto): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDto);
  }
  async signIn (authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const {email, pwd} = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({email:email});

    if (user &&  (await bcrypt.compare(pwd, user.pwd))){
      // 유저 토큰 생성(Secret + Payload)
      const payload = { email };
      const accessToken = this.jwtService.sign(payload);
      return {accessToken};
    }else {
      throw new UnauthorizedException('login failed')
    }
  }
}
