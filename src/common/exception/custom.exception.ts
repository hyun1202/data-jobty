// // import { ErrorCode } from "./error.code";
// import { HttpException } from "@nestjs/common";
//
// export class CustomException extends HttpException{
//   constructor(errorCode: ErrorCode) {
//     super(errorCode.msg, errorCode.status);
//     this.errorCode = errorCode;
//   }
//   private errorCode: ErrorCode;
// }