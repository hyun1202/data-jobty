import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { User } from "../../../users/entities/user.entity";
import { Template } from "../../template/entities/template.entity";
import { Timestamped } from "../../../common/timestamped/time-stamped";
import { CreateDetailDto } from "../dto/create-detail.dto";

@Entity({ name : "setting" })
export class Setting extends Timestamped{
  @PrimaryColumn()
  domain: string;
  @OneToOne(() => User)
  @JoinColumn({name: "member_id"})
  user: User;
  @Column({name: "favicon_img", nullable: true})
  faviconImg: string;
  @Column({name: "blog_name", nullable: true})
  blogName: string;
  @Column({name: "blog_description", nullable: true})
  blogDescription: string;
  @Column({name: "blog_keyword", nullable: true})
  blogKeyword: string;
  @OneToOne(() => Template)
  @JoinColumn({name: "template_id"})
  template: Template;
  @Column({name: "template_use", nullable: true})
  templateUse: string;

  update(createDetailDto: CreateDetailDto) {
    this.blogName = createDetailDto.blog_name;
    this.blogDescription = createDetailDto.blog_description;
    this.blogKeyword = createDetailDto.blog_keyword;
    this.faviconImg = createDetailDto.favicon_img;
  }
}
