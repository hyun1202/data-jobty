import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/request/create-menu.dto";
import { UpdateMenuDto } from "./dto/request/update-menu.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "../../auth/decorator/get-user.decorator";
import { User } from "../../users/entities/user.entity";
import { UpdateAllMenuDto } from "./dto/request/update-all-menu.dto";

@ApiTags("Menu")
// @Controller('menu')
@Controller(':domain/menu')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({
    summary: "메뉴 추가",
    description: "해당하는 도메인에 메뉴를 추가한다."
  })
  create(@Param('domain') domain: string,
         @Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(domain, createMenuDto);
  }

  @Get()
  @ApiOperation({
    summary: "메뉴 조회",
    description: "해당하는 도메인의 모든 메뉴를 조회한다."
  })
  findAll(@Param('domain') domain: string,
          @GetUser() user: User) {
    return this.menuService.findMenus(domain, user.id);
  }

  @ApiOperation({
    summary: "메뉴 수정",
    description: "해당하는 도메인의 메뉴를 정렬 제외하고 단건 수정한다."
  })
  @Put()
  update(@Param('domain') domain: string,
         @GetUser() user: User,
         @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(domain, user.id, updateMenuDto);
  }

  @ApiOperation({
    summary: "메뉴 삭제",
    description: "해당하는 도메인의 메뉴를 삭제한다."
  })
  @Delete(':menuId')
  remove(@Param('domain') domain: string,
         @Param('menuId') menuId: number,
         @GetUser() user: User) {
    return this.menuService.remove(menuId, domain, user.id);
  }

  @ApiOperation({
    summary: "메뉴 전체 수정",
    description: "해당하는 도메인의 전체 메뉴를 수정한다. 수정 타입 0: 생성, 1: 수정, 2: 삭제"
  })
  @Post('all')
  async updateAll(@Param('domain') domain: string,
                  @Body() updateAllMenuDto: UpdateAllMenuDto,
                  @GetUser() user: User) {
    return await this.menuService.allCreateAndUpdateAndRemove(domain, user.id, updateAllMenuDto.menus);
  }
}
