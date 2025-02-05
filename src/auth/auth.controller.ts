import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './DTO/sign-in-user-dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService){}

  @Post()
  loginUser(@Body()signInDto: SignInDto){
   return this.authService.authenticate(signInDto)
  }
}
