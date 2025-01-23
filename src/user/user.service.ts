import { PrismaService } from './../prisma/prisma.service';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './userDTO/create-user-dto';

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

}
