import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthCredentialsDto, VerificationDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "../users/users.repository";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";
import { CustomException } from "../common/exception/custom.exception";
import { ErrorCode } from "../common/exception/error.code";

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
      throw new CustomException(ErrorCode.DUPLICATED_EMAIL);
    }
    // 이메일 인증 코드 생성
    const verificationCode = Math.floor(Math.random() * 10000).toString();
    // 이메일 보내기
    await this.emailService.sendVerificationCode(email, verificationCode);
    // 사용자 생성
    await this.usersRepository.createUser({ ...authCredentialsDto, verificationCode });
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, pwd } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (user && (await bcrypt.compare(pwd, user.pwd))) {
      // 이메일이 인증되었는지 확인
      if (!user.status) {
        throw new CustomException(ErrorCode.NOT_ACTIVATED_ACCOUNT);
      }
      // 유저 토큰 생성(Secret + Payload)
      const payload = { email };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new CustomException(ErrorCode.INCORRECT_PASSWORD);
    }
  }

  async verifyEmail(verificationDto: VerificationDto) {
    const {email, verificationCode} = verificationDto;
    if (!await this.usersRepository.existsBy({ email, verificationCode })) {
      throw new CustomException(ErrorCode.INVALID_VERIFICATION);
    }
    // 이메일 인증 상태 업데이트
    await this.usersRepository.updateVerificationStatus(email, true);
    return "인증 완료되었습니다.";
  }
}
