import { UpdateMenuDto } from "./update-menu.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAllMenuDto {
  @ApiProperty({
    description: "메뉴 정보",
    type: [UpdateMenuDto]
  })
  menus: UpdateMenuDto[]
}

