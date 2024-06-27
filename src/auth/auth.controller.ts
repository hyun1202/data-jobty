import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto, VerificationDto } from "./dto/auth-credentials.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorator/get-user.decorator";
import { User } from "../users/entities/user.entity";
import { ValidationPipe } from "../common/validation/validation.pipe";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: "로그인",
    description: "로그인"
  })
  @Post('/signin')
  signIn(@Body(new ValidationPipe()) loginUserDto: LoginUserDto): Promise<{ accessToken: string }>{
    return this.authService.signIn(loginUserDto)
  }

  // 인증번호 -> 인증 토큰으로 변경될 수 있음
  @ApiOperation({
    summary: "인증번호 발송",
    description: "회원가입을 위해 인증번호를 발송한다."
  })
  @Post('/verification')
  async verifyEmail(@Body(new ValidationPipe()) verificationDto: VerificationDto){
    return await this.authService.verifyEmail(verificationDto)
  }

  @Post('/signout')
  async signOut(@GetUser() user: User) {
    return await this.authService.signOut(user);
  }
}
