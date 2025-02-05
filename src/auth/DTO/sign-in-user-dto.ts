import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInDto{
  @IsEmail()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userPassword: string;
}