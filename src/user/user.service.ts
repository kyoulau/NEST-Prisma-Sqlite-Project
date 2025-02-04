import { IsEmail } from 'class-validator';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './userDTO/create-user-dto';
import { GetUserDto } from './userDTO/get-user-dto';
import { User } from '@prisma/client';
import { UpdateUserDto } from './userDTO/update-user-dto';
import { HashingServiceProtocol } from 'src/auth/hash/bcrypt.service';

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

  async updateUser(id:number,updateUserDto:UpdateUserDto){
    try{
      const userForFind = await this.prisma.user.findFirst({
        where:{id:id}
      })

      if (userForFind?.username){

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
              userPassword: dataUser?.userPassword ?? userForFind.userPassword
            },
            select:{
              id: true,
              username: true,
              userEmail: true
            }
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
          message: "User deleted with success"
        }
      }

    } catch(err){
      console.log(err)
    }
  }

}
