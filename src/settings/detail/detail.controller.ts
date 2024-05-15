import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { DetailService } from './detail.service';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { ValidationPipe } from "../../common/validation/validation.pipe";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../../auth/get-user.decorator";
import { User } from "../../users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('setting-detail')
@Controller('setting/detail')
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async create(@GetUser() user: User, @Body(new ValidationPipe()) createDetailDto: CreateDetailDto) {
    return await this.detailService.create(user, createDetailDto);
  }

  @Get()
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
