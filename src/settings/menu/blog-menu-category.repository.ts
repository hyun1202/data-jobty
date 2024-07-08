import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { BlogMenuCategory } from "./entities/blog-menu-category.entity";

@Injectable()
export class BlogMenuCategoryRepository extends Repository<BlogMenuCategory>{
  constructor( private dataSource: DataSource ) {
    super(BlogMenuCategory, dataSource.createEntityManager());
  }
}