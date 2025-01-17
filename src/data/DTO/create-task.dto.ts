import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateTaskDto {

  @IsString()
  @MinLength(5)
  @IsNotEmpty()
  readonly title: string;
  @IsString()
  readonly description: string;
  @IsString()
  readonly priority: string

}