import { Injectable } from '@nestjs/common';
import { CreateDetailDto } from './dto/create-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { DetailRepository } from "./detail.repository";
import { User } from "../../users/entities/user.entity";
import { Setting } from "./entities/detail.entity";
import { Builder } from "builder-pattern";
import { CustomException } from "../../common/exception/custom.exception";
import { ErrorCode } from "../../common/exception/error.code";
import { ResponseDetailDto } from "./dto/response-detail.dto";

@Injectable()
export class DetailService {
  constructor(readonly detailRepository: DetailRepository) {}
  async create(user: User, createDetailDto: CreateDetailDto) {
    // 계정에 도메인 데이터 있는지 확인
    if (await this.detailRepository.existsByMemberId(user.id)) {
      throw new CustomException(ErrorCode.EXISTS_DOMAIN)
    }
    // 도메인 중복 확인
    const domain = createDetailDto.domain;
    if (await this.detailRepository.existsBy({ domain })) {
      throw new CustomException(ErrorCode.DOMAIN_DUPLICATED);
    }

    // TODO 템플릿은 기본 템플릿 설정

    const createSetting: Setting = Builder(Setting)
      .user(user)
      .domain(createDetailDto.domain)
      .blogName(createDetailDto.blog_name)
      .blogDescription(createDetailDto.blog_description)
      .blogKeyword(createDetailDto.blog_keyword)
      .faviconImg(createDetailDto.favicon_img)
      .build();

    return new ResponseDetailDto(await this.detailRepository.save(createSetting));
  }

  findAll() {
    return `This action returns all detail`;
  }

  async findOne(domain: string) {
    const setting: Setting = await this.detailRepository.findOneBy({ domain: domain });
    if (setting == null) {
      throw new CustomException(ErrorCode.DOMAIN_DUPLICATED);
    }
    return new ResponseDetailDto(setting);
  }

  update(id: number, updateDetailDto: UpdateDetailDto) {
    return `This action updates a #${id} detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }

}
