import { TErrorCode } from "./error.code";
import { HttpException } from "@nestjs/common";

export class CustomException extends HttpException{
  constructor(errorCode: TErrorCode) {
    super(errorCode.msg, errorCode.status);
    this.errorCode = errorCode;
  }
  private errorCode: TErrorCode;
}