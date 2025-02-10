import { IsEmail } from 'class-validator';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './userDTO/create-user-dto';
import { GetUserDto } from './userDTO/get-user-dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './userDTO/update-user-dto';
import { HashingServiceProtocol } from 'src/auth/hash/bcrypt.service';
import { PayloadTokenDto } from 'src/auth/DTO/payload-token.dto';

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

}
