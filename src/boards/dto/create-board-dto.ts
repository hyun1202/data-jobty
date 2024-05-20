import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
  @ApiProperty({description: '제목'})
  @IsNotEmpty()
  title: string;
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
