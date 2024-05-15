import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../../users/entities/user.entity";

@Entity({ name : "template" })
export class Template {
  @PrimaryGeneratedColumn() id: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
  @Column()
  thumbnail: string;
  @Column({name: "template_name"})
  templateName: string;
  @Column({name: "template_keyword"})
  templateKeyword: string;
}
