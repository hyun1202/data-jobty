import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../users/entities/user.entity";
import { Timestamped } from "../../../common/timestamped/time-stamped";

@Entity({ name : "template" })
export class Template extends Timestamped{
  @PrimaryGeneratedColumn({name: "template_id"})
  id: number;
  @OneToOne(() => User)
  @JoinColumn({name: "user_id"})
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