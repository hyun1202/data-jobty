import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor
} from "@nestjs/common";
import { catchError, Observable, tap } from "rxjs";
import { DataSource } from "typeorm";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    console.log("transaction 인터셉터 실행");
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const request = context.switchToHttp().getRequest();
    request.queryRunnerManager = queryRunner.manager;

    return next.handle().pipe(
      catchError(async (e) => {
        console.log("에러발생, 전체 롤백 실행합니다.");
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        if (e instanceof HttpException) {
          throw new HttpException(e.getResponse(), e.getStatus());
        }
        throw new InternalServerErrorException();
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
        console.log("트랜잭션 완료");
      }),
    );
  }
}