import { Body, Controller, Post, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "../users/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authcredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authcredentialsDto)
  }
  @Post('/signin')
  signIn(@Body(ValidationPipe) authcredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }>{
    return this.authService.signIn(authcredentialsDto)
  }
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log('user', user);
  }
}
