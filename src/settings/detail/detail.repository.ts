import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Setting } from "./entities/detail.entity";

@Injectable()
export class DetailRepository extends Repository<Setting>{
  constructor( private dataSource: DataSource ) {
    super(Setting, dataSource.createEntityManager());
  }
}