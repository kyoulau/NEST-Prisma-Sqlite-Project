import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_TOKEN_PAYLOAD_NAME } from "../common/auth.constants";

export const TokenPayloadParam = createParamDecorator(
  (data: unknown , ctx: ExecutionContext) => {
    //objeto ctx permite fornecer acesso ao contexto da requisição: Request e response
    const context = ctx.switchToHttp()
    const request : Request = context.getRequest()

    return request[REQUEST_TOKEN_PAYLOAD_NAME]

  }

)

//Funcionamento do Decorador:

//Quando a requisição chega ao método updateUserById, o NestJS executa o decorador TokenPayloadParam.

//O decorador acessa o objeto request e retorna o valor armazenado em request[REQUEST_TOKEN_PAYLOAD_NAME].

//Esse valor é então passado para o parâmetro tokenPayload(ou o nome que voce escolher).