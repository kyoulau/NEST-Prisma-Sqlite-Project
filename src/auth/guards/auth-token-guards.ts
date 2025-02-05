import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";

@Injectable()
export class AuthTokenGuar implements CanActivate{

  constructor(
    private readonly jwtService: JwtService,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType< typeof jwtConfig>,
  ){}

  extractTokenHeader(request: Request){
    const authorization = request.headers?.authorization


    if(!authorization || typeof authorization !== "string"){
      return
    }
    return authorization.split(' ')[1]
  }

  async canActivate(context: ExecutionContext):  Promise<boolean>  {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenHeader(request)

    if(!token || undefined){
      console.log("Token no existe")
      throw new HttpException("Token no existe",HttpStatus.NOT_FOUND)
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfiguration)

      request[REQUEST_TOKEN_PAYLOAD_NAME] = payload


    } catch (error) {
      console.log(error)
      throw new HttpException("Acesso não autorizado", HttpStatus.UNAUTHORIZED)
      
    }

    return true
    
    
  }
}