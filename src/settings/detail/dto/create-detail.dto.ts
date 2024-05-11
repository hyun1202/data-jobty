import { IsNotEmpty, IsString } from "class-validator";

export class CreateDetailDto {
  @IsNotEmpty()
  domain: string;
  @IsString()
  favicon_img: string;
  blog_name: string;
  blog_description: string;
  blog_keyword: string[];
}
