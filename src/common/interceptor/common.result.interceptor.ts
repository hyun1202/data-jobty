import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { CommonResult } from "../response/common.result";

export interface Response<T> {
  data: T;
}

export class CommonResultInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<Response<T>> {
      const commonRes = CommonResult.getSuccessResult();
      return next
          .handle()
          .pipe(map(data => ({
            ...commonRes,
            data
          })))
    }

}