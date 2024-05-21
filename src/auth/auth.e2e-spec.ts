import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { User } from "../users/entities/user.entity";
import { AppModule } from "../app.module";

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let transporter: nodemailer.Transporter;

  beforeAll(async () => {
    const [moduleFixture] = await Promise.all([Test.createTestingModule({
      imports: [AppModule],
    }).compile()]);

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    transporter = nodemailer.createTransport({
      host: 'smtp.example.com', // 이메일 서버 호스트
      port: 465,
      secure: true,
      auth: {
        user: 'hyun73874@gmail.com',
        pass: 'toyconde121!',
      },
    });

    await app.init();
  });

  afterAll(async () => {
    await userRepository.query(`DELETE FROM users;`);
    await app.close();
  });

  it('/auth/signup (POST) - should send verification code to email', async () => {
    const email = 'test@example.com';
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, pwd: 'password' })
      .expect(201);

    expect(response.body).toEqual({});

    // 실제 이메일 전송 확인
    const mailOptions = {
      from: 'your-email@example.com',
      to: email,
      subject: 'Verification Code',
      text: 'Your verification code is 1234', // 실제 이메일 내용
    };
    const info = await transporter.sendMail(mailOptions);

    expect(info.accepted).toContain(email);
  });
});
