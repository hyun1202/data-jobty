import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { MenuRepository } from "./menu.repository";
import { BlogMenuCategoryRepository } from "./blog-menu-category.repository";
import { AuthModule } from "../../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Menu } from "./entities/menu.entity";
import { BlogMenuCategory } from "./entities/blog-menu-category.entity";

@Module({
  imports: [AuthModule,
    TypeOrmModule.forFeature([Menu, BlogMenuCategory])],
  controllers: [MenuController],
  providers: [MenuService, MenuRepository, BlogMenuCategoryRepository],
})
export class MenuModule {}
