import { Controller, Delete, Get, Patch, Post, Body, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './userDTO/create-user-dto';
import { SuccessInterceptor } from './Interceptor/sucess-interceptor-interface';

@Controller('user')
export class UserController {
  constructor(private userService: UserService){}

  //cria usuário
  @Post()
  @UseInterceptors(SuccessInterceptor)
  async createUser(@Body() createUserDto: CreateUserDto){
    return this.userService.createUser(createUserDto)
  }

  // @Get()

  // @Get(':id')

  // @Patch()

  // @Delete()
}
