import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { TCommonCode } from "../exception/error.code";
import { CustomException } from "../exception/custom.exception";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  VALIDATION_FALIED_CODE = 10;
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new CustomException(this.toCommonCode(errors[0].property));
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private toCommonCode(field: string) : TCommonCode {
    return {
      code: this.VALIDATION_FALIED_CODE,
      msg: `[${field}]가 존재하지 않거나 맞지 않는 데이터 형식입니다.`
    }
  }

}