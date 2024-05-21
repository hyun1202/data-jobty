import { Injectable } from "@nestjs/common";
import { CreateDetailDto, CreateDomainDto } from "./dto/create-detail.dto";
import { DetailRepository, selectOptions } from "./detail.repository";
import { User } from "../../users/entities/user.entity";
import { Setting } from "./entities/detail.entity";
import { Builder } from "builder-pattern";
import { CustomException } from "../../common/exception/custom.exception";
import { ErrorCode } from "../../common/exception/error.code";
import { ResponseDetailDto } from "./dto/response-detail.dto";
import { Template } from "../template/entities/template.entity";

@Injectable()
export class DetailService {
  constructor(readonly detailRepository: DetailRepository) {}

  async update(domain: string, user: User, createDetailDto: CreateDetailDto) {
    const setting= await this.findOneByDomainAndMemberId(domain, user.id);
    setting.update(createDetailDto);
    return new ResponseDetailDto(await this.detailRepository.save(setting));
  }

  findAll() {
    return `This action returns all detail`;
  }

  remove(id: number) {
    return `This action removes a #${id} detail`;
  }

  async createDomain(user: User, createDomainDto: CreateDomainDto) {
    await this.existsDomainByMemberId(user.id);
    await this.existsDomain(createDomainDto.domain);

    // 템플릿은 기본 템플릿 설정
    const template: Template = Builder(Template)
      .id(1)
      .build();

    const createSetting: Setting = Builder(Setting)
      .user(user)
      .domain(createDomainDto.domain)
      .template(template)
      .build();

    return new ResponseDetailDto(await this.detailRepository.save(createSetting));
  }

  /**
   * 도메인으로 설정 정보를 찾는다.
   * @param domain 도메인
   * @throws CustomException Errorcode.DOMAIN_NOTFOUND
   */
  async findDomain(domain: string) {
    const setting: Setting = await this.detailRepository.findOneBy({ domain: domain });
    if (setting == null) {
      throw new CustomException(ErrorCode.DOMAIN_NOTFOUND);
    }
    return setting;
  }

  /**
   * 도메인과 유저ID로 설정 정보를 찾는다.
   * @param domain 도메인
   * @throws CustomException Errorcode.DOMAIN_NOTFOUND
   */
  async findOneByDomainAndMemberId(domain: string, memberId: string) : Promise<Setting>{
    const setting = await this.detailRepository.findAll({where: {domain, memberId}}) as Setting;
    if (setting == null) {
      throw new CustomException(ErrorCode.DOMAIN_NOTFOUND);
    }
    return setting;
  }

  private async existsDomain(domain: string) {
    // 도메인 중복 확인
    if (await this.detailRepository.existsBy({ domain })) {
      throw new CustomException(ErrorCode.DOMAIN_DUPLICATED);
    }
  }

  private async existsDomainByMemberId(memberId: string) {
    // 계정에 도메인 데이터 있는지 확인
    if (await this.detailRepository.findAll({where: {memberId}, select: selectOptions.Exists})) {
      throw new CustomException(ErrorCode.EXISTS_DOMAIN);
    }


  }
}
