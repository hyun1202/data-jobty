import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name : "member" })
export class User {
  @PrimaryColumn()
  member_id : string
  @Column()
  email : string
  @Column()
  pwd : string
  @Column()
  roles : string
  @Column()
  withdraw_dt : string
  @Column()
  status : number
  @Column()
  last_login_dt : string
  @Column()
  reg_dt : string
  @Column()
  update_dt : string
}
