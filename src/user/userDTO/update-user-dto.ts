import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user-dto";
import { IsOptional } from "class-validator";

export class UpdateUserDto{
  @IsOptional()
  username: string

  @IsOptional()
  userEmail: string

  @IsOptional()
  userPassword: string

  @IsOptional()
  userRoleAtributed: string

}