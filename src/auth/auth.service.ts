import { sign } from 'crypto';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { SignInDto } from './DTO/sign-in-user-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from './hash/bcrypt.service';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor( 
    private prisma: PrismaService,
    private readonly hashing: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType< typeof jwtConfig>,
    private readonly jwtService: JwtService
  ) {}



  async authenticate(signInDto: SignInDto) {
    //busca usuário no prisma
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          //busca usuário pelo email e se ele for ativo
          userEmail: signInDto.userEmail,
          active: true
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

        //faz o token pelo login do usuário

        const usertoken = await this.jwtService.signAsync(
          {
            id: user.id,
            userEmail: user.userEmail
          },
          {
            secret: this.jwtConfiguration.secret,
            issuer: this.jwtConfiguration.issuer
          }
        )
        return{
          sub: user.id,
          token:usertoken
        }
        
    } catch (error) {
      console.log(error)
      throw new HttpException("Usuário não encontrado.", HttpStatus.BAD_REQUEST)
    }
  }

}
