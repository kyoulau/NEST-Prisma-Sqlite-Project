
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  @MaxLength(255)
  title:string;

  @IsOptional()
  @IsString()
  description:string;

  @IsNotEmpty()
  @IsBoolean()
  completed: boolean=false;

  @CreateDateColumn()
  createdAt: Date;

  //@UpdateDateColumn()
  //updatedAt: Date;

  @IsString()
  priority: string;

  //adicionar a referencia do usuario atribuido a tarefa 
}