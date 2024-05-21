import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { DetailService } from "./detail.service";
import { CreateDetailDto, CreateDomainDto } from "./dto/create-detail.dto";
import { UpdateDetailDto } from "./dto/update-detail.dto";
import { ValidationPipe } from "../../common/validation/validation.pipe";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../../auth/get-user.decorator";
import { User } from "../../users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";

@ApiTags('setting-detail')
@Controller('setting')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class DetailController {
  constructor(private readonly detailService: DetailService) {}

  @Post(':domain')
  @ApiOperation({
    summary: "설정 저장",
    description: "해당하는 도메인에 토큰 정보로 설정 정보를 저장한다."
  })
  async update(@Param('domain') domain: string,
               @GetUser() user: User,
               @Body(new ValidationPipe()) createDetailDto: CreateDetailDto) {
    return await this.detailService.update(domain, user, createDetailDto);
  }

  @ApiOperation({
    summary: "도메인 저장",
    description: "토큰 정보로 도메인 정보를 저장한다."
  })
  @Post()
  async createDomain(@GetUser() user: User, @Body(new ValidationPipe()) createDomainDto: CreateDomainDto) {
    return this.detailService.createDomain(user, createDomainDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detailService.findDomain(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detailService.remove(+id);
  }
}
