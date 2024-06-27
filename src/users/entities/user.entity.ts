import { Column, Entity, PrimaryColumn } from "typeorm";
import { Timestamped } from "../../common/timestamped/time-stamped";

@Entity({ name : "users" })
export class User extends Timestamped{
  constructor(
    // id: string,
    email: string,
    pwd: string,
    nickname: string,
  ) {
    super();
    this.id = crypto.randomUUID();
    this.email = email;
    this.pwd = pwd;
    this.nickname = nickname;
    this.roles = "ROLE_USER";
  }

  @PrimaryColumn({name: "user_id"})
  id : string
  @Column({unique: true})
  email : string
  @Column()
  pwd : string
  @Column()
  nickname : string
  @Column()
  roles : string
  @Column({ name: "withdraw_dt" })
  withdrawDt : Date
  @Column({ default: false })
  status : boolean
  @Column({ name: "last_login_dt", nullable: true })
  lastLoginDt : Date
  @Column({ name: "verification_code", nullable: true })
  verificationCode: string;

  withdraw() : void{
    this.withdrawDt = new Date();
  }
}
