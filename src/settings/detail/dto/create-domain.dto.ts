import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateDomainDto{
  @ApiProperty()
  @IsNotEmpty()
  domain: string;
}