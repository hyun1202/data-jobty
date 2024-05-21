import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: true, // SSL 보안 연결 사용
      service: 'gmail',
      auth: {
        user: 'hyun73874@gmail.com',
        pass: 'vvdlfvubqrubcjbj',
      },
    });
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: 'jobty@jobty.com',
        to,
        subject: '인증번호',
        text: `인증번호는  ${code} 입니다.`,
      });
      console.log('Verification code email sent');
    } catch (error) {
      console.error('이메일 전송에 오류가 발생하였습니다.:', error);
      throw new Error('전송에 실패하였습니다.');
    }
  }
}
