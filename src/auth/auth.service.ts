import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "../users/users.repository";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService
  ) {}

  async signUp(authCredentialsDto : AuthCredentialsDto): Promise<void> {
    const { email } = authCredentialsDto;
    // 이메일이 이미 존재하는지 확인
    const existingUser = await this.usersRepository.findOneBy({email});
    if (existingUser) {
      throw new Error('Email already exists');
    }
    // 이메일 인증 코드 생성
    const verificationCode = Math.floor(Math.random() * 10000).toString();
    // 이메일 보내기
    await this.emailService.sendVerificationCode(email, verificationCode);
    // 사용자 생성
    await this.usersRepository.createUser({ ...authCredentialsDto });
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, pwd } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(pwd, user.pwd))) {
      // 이메일이 인증되었는지 확인
      if (!user.isVerified) {
        throw new UnauthorizedException('Email not verified');
      }
      // 유저 토큰 생성(Secret + Payload)
      const payload = { email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Login failed');
    }
  }

  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.verificationCode !== code) {
      throw new Error('Invalid verification code');
    }
    // 이메일 인증 상태 업데이트
    await this.usersRepository.updateVerificationStatus(email, true);
  }
}
