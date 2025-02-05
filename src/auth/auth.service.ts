import { sign } from 'crypto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './DTO/sign-in-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/bcrypt.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor( 
    private prisma: PrismaService,
    private hashing: HashingServiceProtocol,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType< typeof jwtConfig>
  ) {}
  async authenticate(signInDto: SignInDto) {
    //busca usuário no prisma
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          userEmail: signInDto.userEmail
        }})

        if(!user){
          throw new HttpException("Erro ao fazer login", HttpStatus.UNAUTHORIZED)
        }
        //se não encontrar, retorna erro unathorized

        //se encontrar, compara a senha
        const passwordIsValid = await this.hashing.compare(signInDto.userPassword, user.userPassword)

        if(!passwordIsValid){
          throw new HttpException("As credenciais dadas estão incorretas", HttpStatus.UNAUTHORIZED)
        }

        return{
          id: user.id,
          username: user.username,
          userEmail: user.userEmail,
        }
    } catch (error) {
      console.log(error)
    }



  

  }
}
