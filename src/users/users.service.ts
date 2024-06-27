import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersRepository } from "./users.repository";
import { User } from "./entities/user.entity";
import { CustomException } from "../common/exception/custom.exception";
import { ErrorCode } from "../common/exception/error.code";
import { EmailService } from "../email/email.service";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository,
              private readonly emailService: EmailService) {
  }

  /**
   * 회원가입
   * @param createUserDto 회원가입 정보
   */
  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const { email } = createUserDto;
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
    await this.usersRepository.createUser({ ...createUserDto, verificationCode });
  }

  /**
   * 유저 탈퇴 처리
   * @param user 탈퇴할 유저
   */
  async withdraw(user: User) {
    user.withdraw();
    this.usersRepository.update(user.email, { withdrawDt: user.withdrawDt });
  }
}
