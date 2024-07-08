import { ApiProperty } from "@nestjs/swagger";
import { SubMenuDto } from "../menu.dto";
import { Menu } from "../../entities/menu.entity";

export class MenuResDto {
  constructor(menu: Menu) {
    this.menu_id = menu.id;
    this.menu_type = menu.type;
    this.category_name = menu?.menuCategory?.categoryName || '';
    this.menu_name = menu.menuName;
    this.group_no = menu.groupNo;
    this.sort_no = menu.sortNo;
    this.sub = menu?.subs?.map(sub => new SubMenuDto(sub)) ?? null;
  }
  @ApiProperty({description: '메뉴 분류번호'})
  menu_id: number
  @ApiProperty({description: '메뉴 타입'})
  menu_type: number
  @ApiProperty({description: '카테고리명'})
  category_name: string
  @ApiProperty({description: '메뉴명'})
  menu_name: string
  @ApiProperty({description: '대분류 정렬번호'})
  group_no: number
  @ApiProperty({description: '소분류 정렬번호'})
  sort_no: number
  @ApiProperty({description: '소분류'})
  sub: SubMenuDto[]
}