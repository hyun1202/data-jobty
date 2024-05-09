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
  status: number;
  success: boolean;
  code: number;
  msg: string;
}