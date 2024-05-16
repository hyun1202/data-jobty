import { TCommonCode } from "../exception/error.code";

type TResult = {
  success: boolean,
  code: number,
  msg: string,
}

export class CommonResult {
  constructor(
    success: boolean,
    code: number,
    msg: string
  ) {
    this.success = success;
    this.code = code;
    this.msg = msg;
  }
  readonly success: boolean;
  readonly code: number;
  readonly msg: string;

  static getFailResult(commonCode?: TCommonCode) : TResult {
    return {
      success: false,
      code: commonCode?.code || -1,
      msg: commonCode?.msg || '실패하였습니다.',
    }
  }

  static getSuccessResult(commonCode?: TCommonCode) : TResult {
    return {
      success: true,
      code: commonCode?.code || 1,
      msg:  commonCode?.msg || "성공하였습니다."
    }
  }
}