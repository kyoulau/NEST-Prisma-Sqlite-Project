import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateClassDTO extends PartialType(CreateTaskDto){
  @IsBoolean()
  @IsOptional()
  readonly completed?: boolean;
}