import { ApiProperty } from "@nestjs/swagger";
import { Menu } from "../entities/menu.entity";

export class MainMenuDto {
  @ApiProperty({description: '메뉴 분류번호'})
  menu_id: number
  @ApiProperty({description: '상위 메뉴 분류번호'})
  upper_menu_id: number
  @ApiProperty({description: '메뉴 타입'})
  menu_type: number
  @ApiProperty({description: '소분류 정렬번호'})
  sort_no: number
}

export class SubMenuDto {
  constructor(subMenu: Menu) {
    this.menu_id = subMenu.id;
    this.upper_menu_id = subMenu.upperMenuId;
    this.menu_type = subMenu.type;
    this.menu_name = subMenu.menuName;
    this.group_no = subMenu.groupNo;
    this.sort_no = subMenu.sortNo;
  }
  @ApiProperty({description: '메뉴 분류번호'})
  menu_id: number
  @ApiProperty({description: '상위 메뉴 분류번호'})
  upper_menu_id: number
  @ApiProperty({description: '메뉴 타입'})
  menu_type: number
  @ApiProperty({description: '메뉴명'})
  menu_name: string
  @ApiProperty({description: '대분류 정렬번호'})
  group_no: number
  @ApiProperty({description: '소분류 정렬번호'})
  sort_no: number
}