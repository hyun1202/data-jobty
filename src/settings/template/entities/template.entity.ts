import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../users/entities/user.entity";
import { Timestamped } from "../../../common/timestamped/common-timestamped";

@Entity({ name : "template" })
export class Template extends Timestamped{
  @PrimaryGeneratedColumn()
  id: string;
  @OneToOne(() => User)
  @JoinColumn({name: "member_id"})
  user: User;
  @Column()
  thumbnail: string;
  @Column({name: "template_name"})
  templateName: string;
  @Column({name: "template_keyword"})
  templateKeyword: string;
  @Column({name: "public_yn"})
  publicYn: string;
}