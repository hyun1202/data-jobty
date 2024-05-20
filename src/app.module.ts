import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DetailModule } from './settings/detail/detail.module';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { MailerModule } from "@nestjs-modules/mailer";
import { BoardsModule } from './boards/boards.module';
import { TemplateModule } from './settings/template/template.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}` || '.env',
      load: [],
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
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
    DetailModule,
    AuthModule,
    TemplateModule,
    AuthModule,
    BoardsModule
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
