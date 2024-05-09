import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { CommonResult } from "../response/common.result";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    const status = exception.getStatus();
    const message = exception.message;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>()

    console.log(`status: ${status}`);
    console.log(`url: ${request.url}: ${request.method}()`);
    console.log(`msg: ${message}`);

    const res = new CommonResult(false, status, message);

    response.status(status).json(res);
  }
}