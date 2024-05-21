import { Column, Entity, PrimaryColumn } from "typeorm";
import { Timestamped } from "../../common/timestamped/time-stamped";

@Entity({ name : "member" })
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
    this.withdraw_dt = '';
  }

  @PrimaryColumn({name: "member_id"})
  id : string
  @Column({unique: true})
  email : string
  @Column()
  pwd : string
  @Column()
  nickname : string
  @Column()
  roles : string
  @Column()
  withdraw_dt : string
  @Column({default: false})
  status : boolean
  @Column({nullable: true})
  last_login_dt : Date
  @Column({ name: "verification_code", nullable: true })
  verificationCode: string;
}
