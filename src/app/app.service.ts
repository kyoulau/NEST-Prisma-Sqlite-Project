import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Olá eu sou uma lista de tarefas feita pela Laura!\n E essa é minha rota de teste 2!';
  }
}
