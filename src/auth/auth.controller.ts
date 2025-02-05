import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { SignInDto } from './DTO/sign-in-user-dto';
import { AuthService } from './auth.service';
import { SuccessInterceptor } from 'src/user/Interceptor/sucess-interceptor-interface';
import { LoggersInterceptor } from 'src/Interceptors/log.interceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post()
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  loginUser(@Body()signInDto: SignInDto){
   return this.authService.authenticate(signInDto)
  }
}
