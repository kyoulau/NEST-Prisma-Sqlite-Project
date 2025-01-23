import { IsIn, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export class CreateTaskDto {


  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly title: string;
  @IsString()
  readonly description: string;

  @IsString()
  @IsIn([TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW])
  readonly priority: string

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number


}

