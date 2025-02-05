import { Controller, Delete, Get, Patch, Post, Body, UseInterceptors, Param, ParseIntPipe, UseFilters, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './userDTO/create-user-dto';
import { SuccessInterceptor } from './Interceptor/sucess-interceptor-interface';
import { GetUserDto } from './userDTO/get-user-dto';
import { LoggersInterceptor } from 'src/Interceptors/log.interceptor';
import { UpdateUserDto } from './userDTO/update-user-dto';
import { HttpExceptionFilter } from 'src/filters/exception-filters';
import { AuthTokenGuar } from 'src/auth/guards/auth-token-guards';
import { Request } from 'express';
import { REQUEST_TOKEN_PAYLOAD_NAME } from 'src/auth/common/auth.constants';
import { NotFoundExceptionFilter } from 'src/auth/filters/token-filter.not-found';

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
  @UseGuards(AuthTokenGuar)
  @UseFilters(NotFoundExceptionFilter)
  async updateUserById(
    @Param('id', ParseIntPipe) id:number, 
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request
  ){
    //arquivo para injetar payload, ele já passou pelo Guard que estava protegendo, passa pelo controller, que é pegado pela nossa constante
    console.log("ID User=",req[REQUEST_TOKEN_PAYLOAD_NAME]?.id)
    return this.userService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  async deleteUserByid(@Param('id', ParseIntPipe)id:number){
    return this.userService.deleteUser(id)
  }
}
