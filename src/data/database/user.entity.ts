import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{

  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  @MinLength(8) @MaxLength(12)
  userPassword:string;
   //senha criptografada

  @CreateDateColumn()
  createdAt: Date;

  @IsNotEmpty()
  @IsString()
  @IsIn(['admin', 'user', 'guest'])
  userRoleAtributed: string;

 
}