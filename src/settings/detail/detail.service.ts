import { Injectable } from "@nestjs/common";
import { CreateDetailDto } from "./dto/create-detail.dto";
import { DetailRepository } from "./detail.repository";
import { User } from "../../users/entities/user.entity";
import { Setting } from "./entities/detail.entity";
import { Builder } from "builder-pattern";
import { CustomException } from "../../common/exception/custom.exception";
import { ErrorCode } from "../../common/exception/error.code";
import { ResponseDetailDto } from "./dto/response-detail.dto";
import { Template } from "../template/entities/template.entity";
import { CreateDomainDto } from "./dto/create-domain.dto";
import { UsersService } from "../../users/users.service";

@Injectable()
export class DetailService {
  constructor(readonly usersService: UsersService,
              readonly detailRepository: DetailRepository) {}

  async update(domain: string, user: User, createDetailDto: CreateDetailDto) {
    const setting= await this.findOneByDomainAndUserId(domain, user.id);
    setting.update(createDetailDto);
    return new ResponseDetailDto(await this.detailRepository.save(setting));
  }

  /**
   * 회원 탈퇴 처리
   * @param user 탈퇴할 회원 정보
   * @param domain 도메인 정보
   */
  async remove(user: User, domain: string) {
    // TODO 회원 탈퇴 처리시 추가할 로직
    // 1. 메뉴 및 블로그 게시글 삭제, 설정 데이터 삭제
    // 2. 회원 탈퇴 처리
    this.usersService.withdraw(user);
  }


  /**
   * 도메인 생성
   * @param user 도메인 생성할 유저 정보
   * @param createDomainDto 생성할 도메인 정보
   */
  async createDomain(user: User, createDomainDto: CreateDomainDto) {
    await this.existsDomainByUserId(user.id);
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
      throw new CustomException(ErrorCode.DOMAIN_NOT_FOUND);
    }
    return setting;
  }

  /**
   * 도메인과 유저ID로 설정 정보를 찾는다.
   * @param domain 도메인
   * @throws CustomException Errorcode.DOMAIN_NOTFOUND
   */
  async findOneByDomainAndUserId(domain: string, userId: string) : Promise<Setting>{
    const setting = await this.detailRepository.findOneBy({domain, user: {id: userId}}) as Setting;
    if (setting == null) {
      throw new CustomException(ErrorCode.ACCOUNT_DOMAIN_NOT_FOUND);
    }
    return setting;
  }

  /**
   * 도메인 중복 확인
   * @param domain 도메인
   */
  async existsDomain(domain: string) {
    // 도메인 중복 확인
    if (await this.detailRepository.existsBy({ domain })) {
      throw new CustomException(ErrorCode.DOMAIN_DUPLICATED);
    }
  }

  /**
   * 계정에 도메인 데이터 있는지 확인
   * @param userId 유저 아이디
   * @private
   */
  private async existsDomainByUserId(userId: string){
    // 계정에 도메인 데이터 있는지 확인
    if (await this.detailRepository.existsBy({user: {id: userId}})) {
      throw new CustomException(ErrorCode.EXISTS_DOMAIN);
    }
  }
}
