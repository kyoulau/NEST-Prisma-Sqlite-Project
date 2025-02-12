import { IsEmail } from 'class-validator';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable, HttpStatus, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './userDTO/create-user-dto';
import { GetUserDto } from './userDTO/get-user-dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './userDTO/update-user-dto';
import { HashingServiceProtocol } from 'src/auth/hash/bcrypt.service';
import { PayloadTokenDto } from 'src/auth/DTO/payload-token.dto';
import * as path from 'path';
import * as fs from 'node:fs/promises';
import { Express } from 'express';
import { Multer } from 'multer';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly hashingService: HashingServiceProtocol
  )
    {}

  async createUser(createUserDto: CreateUserDto){
    try{

      const passwordHash = await this.hashingService.hashing(createUserDto.userPassword)
      
      const newUser = await this.prisma.user.create(
        {
          data: {
            username: createUserDto.username,
            userEmail: createUserDto.userEmail,
            userPassword: passwordHash,
            userRoleAtributed: createUserDto.userRoleAtributed
          },select:{
            id: true,
            username:true,
            userEmail: true,
          }
        })

      return newUser

    } catch(err){
      console.log(err);
      throw new HttpException("Failed to create the user",HttpStatus.BAD_REQUEST)
    }
  }

  async getAllUsers():Promise<GetUserDto[]>{
    try{
      const user: User[] = await this.prisma.user.findMany()
      return user
    } catch(err){
      console.log(err);
      throw new HttpException("Failed to create the user",HttpStatus.BAD_REQUEST)
    }
  }

  async getUserById(id:number){
    try {
      const userForFind= await this.prisma.user.findFirst({
        where:{id:id}
      })
      return userForFind
    } catch (err) {
      console.log(err)
    }
  }

  async updateUser( id:number, updateUserDto:UpdateUserDto, tokenPayload: PayloadTokenDto ){
    try{
      const userForFind = await this.prisma.user.findFirst({
        where:{id:id}
      })

      if(!userForFind){
        throw new HttpException("Usuário não existe!", HttpStatus.BAD_REQUEST)
      }

      if (userForFind.id != tokenPayload.id){
        throw new HttpException("Acesso negado.", HttpStatus.BAD_REQUEST)
      }

      const dataUser: { username?: string, userPassword?: string } = { username: updateUserDto.username ?? userForFind.username }

      if(updateUserDto.userPassword){
        const passwordHash = await this.hashingService.hashing(updateUserDto.userPassword)
        dataUser['userPassword'] = passwordHash

      }
          const newUser = await this.prisma.user.update({
            where:{
              id: userForFind.id
            },
            data: {
              username: dataUser.username,
              userEmail: updateUserDto.userEmail,
              userRoleAtributed:updateUserDto.userRoleAtributed,
              userPassword: dataUser?.userPassword ?? userForFind.userPassword
            },
            select:{
              id: true,
              username: true,
              userEmail: true
            }
          })

          return newUser

    } catch(err){
      console.log(err)
      throw new HttpException('Falha ao atualizar o usuário!', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteUser(id: number, tokenPayload: PayloadTokenDto){
    try{
      const userForExclude= await this.prisma.user.findFirst({
        where:{id:id}
      })

      if (userForExclude.id !== tokenPayload.id){ 
        throw new HttpException("Acesso negado.", HttpStatus.BAD_REQUEST) }

      if (userForExclude?.username){
        await this.prisma.user.delete({
          where:{
            id:userForExclude.id
          }
        })

        return{
          message: "User deleted with success"
        }
      }

    } catch(err){
      console.log(err)
      throw new HttpException('Falha ao atualizar o usuário!', HttpStatus.BAD_REQUEST)
    }
  }

  async uploadImage(
    tokenPayload: PayloadTokenDto, 
    file: Express.Multer.File
  ){
    try {
      if (!file || !file.originalname) {
        throw new BadRequestException('Arquivo inválido ou não enviado.');
      }
      const mimeType = file.mimetype;
      const fileExtension = path.extname(file.originalname).toLocaleLowerCase().substring(1)

      const fileName = `${tokenPayload.id}.${fileExtension}`

      const fileLocal = path.resolve(process.cwd(), 'files', fileName)

      await fs.writeFile(fileLocal, file.buffer)

      const user = await this.prisma.user.findUnique({
        where:{
          id: tokenPayload.id
        }
      })

      if(!user){
        throw new HttpException("Erro ao realizar requisição!", HttpStatus.BAD_REQUEST)
      }

      const updateUser = await this.prisma.user.update({
        where:{
          id: user.id
        },
        data:{
          avatar: fileLocal
        },
        select:{
          id: true,
          userEmail: true,
          avatar:true,
          username: true
        }
      })
      
      return { message: 'Arquivo enviado com sucesso!', file };
      
    } catch (error) {
      console.log(error)
      throw new HttpException("Erro ao realizar requisição!", HttpStatus.BAD_REQUEST)
    }
  }
}
