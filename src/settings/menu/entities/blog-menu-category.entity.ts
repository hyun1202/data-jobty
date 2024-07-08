import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "blog_menu_category" })
export class BlogMenuCategory {
  @PrimaryGeneratedColumn({ name: "menu_category_id" })
  id : number
  @Column({name: "category_type"})
  type: number
  @Column({ name: "category_name" })
  categoryName: string
}