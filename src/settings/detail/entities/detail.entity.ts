import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../../../users/entities/user.entity";
import { Template } from "../../template/entities/template.entity";

@Entity({ name : "setting" })
export class Setting {
  @PrimaryColumn()
  domain: string;
  @OneToOne(() => User)
  @JoinColumn({name: "member_id"})
  user: User;
  @Column({name: "favicon_img"})
  faviconImg: string;
  @Column({name: "blog_name"})
  blogName: string;
  @Column({name: "blog_description"})
  blogDescription: string;
  @Column({name: "blog_keyword"})
  blogKeyword: string;
  @OneToOne(() => Template)
  @JoinColumn()
  template: Template;
  @Column({name: "template_use", nullable: true})
  templateUse: string;
}
