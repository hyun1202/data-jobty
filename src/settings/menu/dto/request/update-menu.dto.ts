import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty } from "class-validator";

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @ApiProperty({description: "메뉴 아이디, 생성인 경우 -1입력"})
  @IsNotEmpty()
  menu_id : number;
  @ApiProperty({description: "수정 타입 0: 생성, 1: 수정, 2: 삭제"})
  edit_type: number;
}
