import { ApiProperty } from "@nestjs/swagger";
import { Setting } from "../entities/detail.entity";

export class ResponseDetailDto {
  constructor(detail: Setting) {
    this.domain = detail.domain;
    this.favicon_img = detail.faviconImg;
    this.blog_name = detail.blogName;
    this.blog_description = detail.blogDescription;
    this.blog_keyword = detail.blogKeyword.split(',');
  }
  @ApiProperty({description: "도메인"})
  domain: string;
  @ApiProperty({description: "썸네일 이미지"})
  favicon_img: string;
  @ApiProperty({description: "블로그명"})
  blog_name: string;
  @ApiProperty({description: "블로그 설명"})
  blog_description: string;
  @ApiProperty({description: "블로그 키워드"})
  blog_keyword: string[];
}