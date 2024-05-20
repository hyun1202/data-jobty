import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name : "member" })
export class User {
  constructor(
    // id: string,
    email: string,
    pwd: string,
    nickname: string,
    roles: string,
    withdraw_dt: string,
    status: number,
    last_login_dt: Date,
    // reg_dt: Date,
    // update_dt: Date
  ) {
    this.id = crypto.randomUUID();
    this.email = email;
    this.pwd = pwd;
    this.nickname = nickname;
    this.roles = "ROLE_USER";
    this.withdraw_dt = '';
    this.status = 0;
    // this.reg_dt = reg_dt;
    // this.update_dt = update_dt;
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
  // 0: 활성화 안된 상태 1: 활성화 2: 탈퇴
  @Column()
  status : number
  @Column({nullable: true})
  last_login_dt : Date
  @UpdateDateColumn()
  reg_dt : Date
  @CreateDateColumn()
  update_dt : Date
  @Column({ nullable: true })
  verificationCode: string;

  @Column({ default: false })
  isVerified: boolean;
}
