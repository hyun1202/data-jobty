import { Injectable } from "@nestjs/common";
import { AuthCredentialsDto, VerificationDto } from "./dto/auth-credentials.dto";
import { UsersRepository } from "../users/users.repository";
import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { CustomException } from "../common/exception/custom.exception";
import { ErrorCode } from "../common/exception/error.code";
import { User } from "../users/entities/user.entity";
import { USER_STATUS } from "../users/entities/user-status";
import { LoginUserDto } from "./dto/login-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  /**
   * 로그인
   * @param loginUserDto 로그인 정보 (email, password)
   */
  async signIn(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, pwd } = loginUserDto;
    const user = await this.usersRepository.findOneBy({ email });

    if (!user || !await bcrypt.compare(pwd, user.pwd)) {
      throw new CustomException(ErrorCode.INCORRECT_PASSWORD);
    }

    // 이메일이 인증되었는지 확인
    if (!user.checkCertification()) {
      throw new CustomException(ErrorCode.NOT_ACTIVATED_ACCOUNT);
    }

    // 유저 토큰 생성(Secret + Payload)
    const payload = { email };
    const accessToken = this.jwtService.sign(payload);
    // TODO refreshToken 추가
    return { accessToken };
  }

  /**
   * 이메일 인증
   * @param verificationDto 이메일 인증 정보
   */
  async verifyEmail(verificationDto: VerificationDto) {
    const {email, verificationCode} = verificationDto;
    if (!await this.usersRepository.existsBy({ email, verificationCode })) {
      throw new CustomException(ErrorCode.INVALID_VERIFICATION);
    }
    // 이메일 인증 상태 업데이트
    await this.usersRepository.updateVerificationStatus(email, USER_STATUS.active);
    return "인증 완료되었습니다.";
  }

  async signOut(user: User) {
    // TODO 리프레시 토큰 삭제
  }
}
