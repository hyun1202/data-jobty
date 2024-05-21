export type TCommonCode = {
  status?: number,  // 기본 값은 200
  success?: boolean, // 기본 값은 false
  code: number,
  msg: string,
}

export class ErrorCode {
  static FAIL: TCommonCode = {
    status: 500,
    code: -1,
    msg: "실패했습니다.",
  }

  static REQUIRED_FIELD: TCommonCode = {
    code: -1,
    msg: "실패했습니다.",
  }

  static ACCOUNT_VALIDATION_FAILED: TCommonCode = {
    code: 11,
    msg: "자격증명 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
  }

  static OPERATION_NOT_AUTHORIZED: TCommonCode = {
    code: 6000,
    msg: "로그인이 안되어있거나 만료된 토큰입니다.",
  }

  static DUPLICATED_EMAIL: TCommonCode = {
    code: 6001,
    msg: "중복된 아이디입니다.",
  }

  static INVALID_VERIFICATION: TCommonCode = {
    code: 6002,
    msg: "유효하지 않은 인증 코드입니다.",
  }

  static INCORRECT_PASSWORD: TCommonCode = {
    code: 6005,
    msg: "계정을 찾을 수 없거나 아이디 또는 비밀번호가 맞지 않습니다.\", \"비밀번호가 맞지 않습니다.",
  }

  static NOT_ACTIVATED_ACCOUNT: TCommonCode = {
    code: 6011,
    msg: "메일 인증이 안된 계정입니다. 메일 인증 완료 후 다시 시도해주세요.",
  }

  static EXISTS_DOMAIN: TCommonCode = {
    code: 7000,
    msg: "이미 해당 계정에 도메인이 존재합니다.",
  }

  static DOMAIN_DUPLICATED: TCommonCode = {
    code: 7001,
    msg: "중복된 도메인입니다. 다른 도메인을 입력해주세요.",
  }

  static ACCOUNT_DOMAIN_NOT_FOUND: TCommonCode = {
    code: 7002,
    msg: "해당 계정에 일치하는 도메인이 없습니다. 도메인을 다시 입력해주세요.",
  }

  static DOMAIN_NOT_FOUND: TCommonCode = {
    code: 7003,
    msg: "해당 계정에 도메인이 없습니다. 생성 후 다시 시도해주세요.",
  }

}