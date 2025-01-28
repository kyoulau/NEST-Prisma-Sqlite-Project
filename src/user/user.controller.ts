import { Controller, Delete, Get, Patch, Post, Body, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './userDTO/create-user-dto';
import { SuccessInterceptor } from './Interceptor/sucess-interceptor-interface';
import { GetUserDto } from './userDTO/get-user-dto';
import { LoggersInterceptor } from 'src/Interceptors/log.interceptor';
import { UpdateUserDto } from './userDTO/update-user-dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService){}

  //cria usuário
  @Post()
  @UseInterceptors(SuccessInterceptor)
  async createUser(@Body() createUserDto: CreateUserDto){
    return this.userService.createUser(createUserDto)
  }

  @Get()
  @UseInterceptors(LoggersInterceptor)
  async getAllUsers(): Promise<GetUserDto[]>{
    const allUsers = await this.userService.getAllUsers();
    return allUsers.map( user =>({
      username: user.username,
      userEmail:user.userEmail,
      userPassword:user.userPassword,
      userRoleAtributed:user.userRoleAtributed,
      createdAt:user.createdAt
    }))
  }

  @Get(':id')
  @UseInterceptors(LoggersInterceptor)
  async getUserById(@Param('id', ParseIntPipe)id:number){
    const uniqueUser = await this.userService.getUserById(id)
    return uniqueUser
  }

  @Patch(':id')
  //@UseInterceptors(LoggersInterceptor)
  async updateUserById(@Param('id', ParseIntPipe) id:number, @Body() updateUserDto: any){
    console.log(id)
    return this.userService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  async deleteUserByid(@Param('id', ParseIntPipe)id:number){
    return this.userService.deleteUser(id)
  }
}
