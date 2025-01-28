import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './userDTO/create-user-dto';
import { GetUserDto } from './userDTO/get-user-dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './userDTO/update-user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService){}

  async createUser(createUserDto: CreateUserDto){
    try{
      const newUser = await this.prisma.user.create(
        {
          data: {
            username: createUserDto.username,
            userEmail: createUserDto.userEmail,
            userPassword: createUserDto.userPassword,
            userRoleAtributed: createUserDto.userRoleAtributed
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

  async updateUser(id:number,updateUserDto:UpdateUserDto){
    try{
      const userForFind= await this.prisma.user.findFirst({
        where:{id:id}
      })

      if (userForFind?.username){
          const newUser = await this.prisma.user.update({
            where:{
              id: userForFind.id
            },
            data: updateUserDto
          })
          return newUser
      }else{
        throw new HttpException("Não existe esse usuário!", HttpStatus.NOT_FOUND)
      }
    } catch(err){
      console.log(err)
    }
  }

  async deleteUser(id: number){
    try{
      const userForExclude= await this.prisma.user.findFirst({
        where:{id:id}
      })

      if (userForExclude?.username){
        await this.prisma.user.delete({
          where:{
            id:userForExclude.id
          }
        })

        return{
          message: "Excluido com sucessooooooo"
        }
      }

    } catch(err){
      console.log(err)
    }
  }

}
