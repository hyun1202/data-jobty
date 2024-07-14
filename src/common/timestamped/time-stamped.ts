import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class Timestamped {
  @CreateDateColumn({name: "reg_dt"})
  regDt: Date
  @UpdateDateColumn({name: "update_dt"})
  updateDt: Date
  @DeleteDateColumn({name: "delete_dt"})
  deleteDt: Date
}