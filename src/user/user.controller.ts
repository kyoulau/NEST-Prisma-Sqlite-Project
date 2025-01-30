import { Controller, Delete, Get, Patch, Post, Body, UseInterceptors, Param, ParseIntPipe, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './userDTO/create-user-dto';
import { SuccessInterceptor } from './Interceptor/sucess-interceptor-interface';
import { GetUserDto } from './userDTO/get-user-dto';
import { LoggersInterceptor } from 'src/Interceptors/log.interceptor';
import { UpdateUserDto } from './userDTO/update-user-dto';
import { HttpExceptionFilter } from 'src/filters/exception-filters';

@Controller('user')
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private userService: UserService){}

  //cria usuário
  @Post()
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  async createUser(@Body() createUserDto: CreateUserDto){
    return this.userService.createUser(createUserDto)
  }

  @Get()
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
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
  @UseInterceptors(SuccessInterceptor)
  async getUserById(@Param('id', ParseIntPipe)id:number){
    const uniqueUser = await this.userService.getUserById(id)
    return uniqueUser
  }

  @Patch(':id')
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  async updateUserById(@Param('id', ParseIntPipe) id:number, @Body() updateUserDto: UpdateUserDto){
    console.log(id)
    return this.userService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  async deleteUserByid(@Param('id', ParseIntPipe)id:number){
    return this.userService.deleteUser(id)
  }
}
