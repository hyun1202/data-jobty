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
  private success: boolean;
  private code: number;
  private msg: string;
}