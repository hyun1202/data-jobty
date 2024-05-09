export type TErrorCode = {
  status?: number,  // 기본 값은 200
  success?: boolean, // 기본 값은 false
  code: number,
  msg: string
}

export class ErrorCode {
  static FAIL: TErrorCode = {
    status: 500,
    code: -1,
    msg: "실패했습니다.",
  }

  static REQUIRED_FIELD: TErrorCode = {
    code: -1,
    msg: "실패했습니다.",
  }

  static ACCOUNT_VALIDATION_FAILED: TErrorCode = {
    code: 10,
    msg: "자격증명 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요.",
  }

  static OPERATION_NOT_AUTHORIZED: TErrorCode = {
    code: 6000,
    msg: "로그인이 안되어있거나 만료된 토큰입니다.",
  }

  static EMAIL_DUPLICATED: TErrorCode = {
    code: 6001,
    msg: "중복된 아이디입니다.",
  }
}