import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMenuDto {
  @ApiProperty({description: "소메뉴인 경우에만 사용"})
  upper_menu_id : number
  @ApiProperty({description: "대메뉴인 경우에만 사용"})
  category_id : number
  @ApiProperty({description: "메뉴 타입 0: 대메뉴, 1:소메뉴"})
  @IsNotEmpty()
  menu_type : number
  @ApiProperty({description: "서브 메뉴 카테고리명, 서브 메뉴일 경우에만 사용"})
  sub_category_name : string;
  @ApiProperty({description: "메뉴명"})
  @IsNotEmpty()
  menu_name : string
  @ApiProperty({description: "대메뉴에서의 정렬 값"})
  @IsNotEmpty()
  group_no : number
  @ApiProperty({description: "소메뉴에서의 정렬 값"})
  @IsNotEmpty()
  sort_no : number
}
