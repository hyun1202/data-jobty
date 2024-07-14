import { Module } from "@nestjs/common";
import { DetailService } from "./detail.service";
import { DetailController } from "./detail.controller";
import { DetailRepository } from "./detail.repository";
import { AuthModule } from "../../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Setting } from "./entities/detail.entity";
import { User } from "../../users/entities/user.entity";
import { UsersModule } from "../../users/users.module";

@Module({
  imports: [AuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Setting])
  ],
  controllers: [DetailController],
  providers: [DetailService, DetailRepository],
})
export class DetailModule {}
