import { PickType } from "@nestjs/mapped-types";
import { IsBoolean, IsDate, IsNumber, IsString } from "class-validator";
import { CreateTaskDto } from "./create-task.dto";

export class GetTaskDto extends PickType(CreateTaskDto, ['title', 'description', 'priority']){

  @IsNumber()
  readonly id: number;

  @IsBoolean()
  readonly completed: boolean;
  readonly createdAt: Date;
}