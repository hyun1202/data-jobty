import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { DetailService } from "./detail.service";
import { CreateDetailDto } from "./dto/create-detail.dto";
import { UpdateDetailDto } from "./dto/update-detail.dto";
import { ValidationPipe } from "../../common/validation/validation.pipe";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../../auth/get-user.decorator";
import { User } from "../../users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('setting-detail')
@Controller('setting/detail')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Post()
  @ApiOperation({
    summary: "도메인 저장",
    description: "토큰 정보로 도메인 정보를 저장한다."
  })
  async create(@GetUser() user: User, @Body(new ValidationPipe()) createDetailDto: CreateDetailDto) {
    return await this.detailService.create(user, createDetailDto);
  }

  @Post()
  findAll() {
    return this.detailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetailDto: UpdateDetailDto) {
    return this.detailService.update(+id, updateDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailService.remove(+id);
  }
}
