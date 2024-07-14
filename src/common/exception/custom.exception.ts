import { TCommonCode } from "./error.code";
import { HttpException } from "@nestjs/common";

export class CustomException extends HttpException{
  constructor(errorCode: TCommonCode) {
    super(errorCode, errorCode.status);
    this.errorCode = errorCode;
  }
  readonly errorCode: TCommonCode;
  readonly errorMsg: string;
}
