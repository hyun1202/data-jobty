import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ValidationPipe } from "../common/validation/validation.pipe";

@ApiTags('user')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({
    summary: "회원가입",
    description: "임시로 회원가입, 계정 활성화를 위한 인증코드를 발송한다."
  })
  signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.signUp(createUserDto)
  }
}
