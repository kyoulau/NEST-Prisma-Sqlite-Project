import { Injectable, NestMiddleware, ExecutionContext } from "@nestjs/common";
import { NextFunction } from "express";

//Middleware para logging : Registra info da requisição,data, hora, método http,url etc
@Injectable()
export class LoggerMiddleware implements NestMiddleware{
  use( req: Request, res: Response, next: NextFunction){
    const requestDateTime = new Date()
    const requestMethodUsed = req.method

    console.log(`-----------------------------------MIDDLLEWARE-----------------------------------\n DATA E HORA DA REQUISIÇÃO - ${requestDateTime}\n MÉTODO DA REQUISIÇÃO - ${requestMethodUsed}`)

    next()
  }
}