import { ArgumentsHost, Catch, ExceptionFilter, HttpException, UnauthorizedException } from "@nestjs/common";
import { Response, Request } from "express";
import { CommonResult } from "../response/common.result";
import { ErrorCode, TCommonCode } from "./error.code";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const status = exception.getStatus() || 200;
    const message = exception.message;
    let errorCode: TCommonCode = exception?.errorCode;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof UnauthorizedException) {
      errorCode = ErrorCode.OPERATION_NOT_AUTHORIZED;
    }

    console.log(`status: ${status}`);
    console.log(`url: ${request.url}: ${request.method}()`);
    console.log(`errorCode: ${errorCode?.code}, msg: ${errorCode?.msg}`);

    const res = CommonResult.getFailResult(errorCode);

    response.status(status).json(res);
  }
}