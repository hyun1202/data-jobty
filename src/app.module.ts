import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3307,
      username: "jobty",
      password: "jobty",
      database: "jobty",
      synchronize: true,
      logging: true,
      entities: ['dist/**/*.entity.js'],
      subscribers: [],
      migrations: [],
    }),
    MailerModule.forRoot({
      transport:{
        host: 'smtp.example.com',
        port:587,
        secure:false,
        auth:{
          user:'jobty',
          pass: 'jobty',
        },
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
