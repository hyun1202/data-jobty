import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class LoginUserDto {
  @ApiProperty({ description: '이메일' })
  @IsNotEmpty({ message: '이메일은 필수 입력 사항입니다.' })
  @IsEmail({}, { message: '유효한 이메일 형식이어야 합니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호(영문,숫자,특수문자 포함 8~20자)' })
  @IsNotEmpty({ message: '비밀번호는 필수 입력 사항입니다.' })
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])[\da-zA-Z!@#$%^&*]{8,20}$/, { message: '비밀번호는 영문, 숫자, 특수문자 포함 8~20자여야 합니다.' })
  pwd: string;
}
