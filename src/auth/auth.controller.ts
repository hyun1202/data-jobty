import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto, VerificationDto } from "./dto/auth-credentials.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "../users/entities/user.entity";
import { ValidationPipe } from "../common/validation/validation.pipe";
import { ApiOperation } from "@nestjs/swagger";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: "회원가입",
    description: "임시로 회원가입, 계정 활성화를 위한 인증코드를 발송한다."
  })

  // TODO 각 컨트롤러에 ApiOperation 적용
  signUp(@Body() authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authcredentialsDto)
  }
  @Post('/signin')
  signIn(@Body(new ValidationPipe()) authcredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }>{
    return this.authService.signIn(authcredentialsDto)
  }
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user', user);
  }

  @Post('/verification')
  async verifyEmail(@Body(new ValidationPipe()) verificationDto: VerificationDto){
    return await this.authService.verifyEmail(verificationDto)
  }
}
