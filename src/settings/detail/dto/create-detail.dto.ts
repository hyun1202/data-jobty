import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  domain: string;
  @ApiProperty()
  @IsString()
  favicon_img: string;
  @ApiProperty()
  blog_name: string;
  @ApiProperty()
  blog_description: string;
  @ApiProperty()
  blog_keyword: string;
}
