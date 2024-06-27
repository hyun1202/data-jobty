import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { DetailService } from "./detail.service";
import { CreateDetailDto, CreateDomainDto } from "./dto/create-detail.dto";
import { ValidationPipe } from "../../common/validation/validation.pipe";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetUser } from "../../auth/decorator/get-user.decorator";
import { User } from "../../users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { ResponseDetailDto } from "./dto/response-detail.dto";

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
  @Post('/domain')
  async createDomain(@GetUser() user: User, @Body(new ValidationPipe()) createDomainDto: CreateDomainDto) {
    return await this.detailService.createDomain(user, createDomainDto);
  }

  @ApiOperation({
    summary: "도메인 중복 확인",
    description: "도메인이 중복되었는지 확인한다."
  })
  @Get('/domain')
  checkDomain(@Query('q') domain: string) {
    return this.detailService.existsDomain(domain);
  }

  @ApiOperation({
    summary: "설정 정보 조회",
    description: "토큰 정보의 회원의 설정 정보를 조회한다."
  })
  @Get(':domain')
  async getSetting(@GetUser() user: User, @Param('domain') domain: string) {
    return new ResponseDetailDto(await this.detailService.findOneByDomainAndMemberId(domain, user.id));
  }

  @ApiOperation({
    summary: "회원 탈퇴",
    description: "토큰 정보의 회원을 삭제한다."
  })
  @Delete()
  remove(@GetUser() user: User, @Param('domain') domain: string) {
    return this.detailService.remove(user, domain);
  }
}
