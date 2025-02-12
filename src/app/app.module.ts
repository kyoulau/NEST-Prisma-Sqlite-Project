import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/data/database/task.entity';
import { User } from 'src/data/database/user.entity';
import { TasksController } from 'src/tasks/tasks.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { AuthModule } from 'src/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
//caminho das imagens
import { join } from 'node:path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'src/database/dev.db',
      entities: [Task, User],
      synchronize: true
    }),
    AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','..', 'files'),
      serveRoot:"/files"
    })
  ],
  controllers: [
    AppController,
     TasksController,
     UserController
    ],
  providers: [
    AppService,
     TasksService,
      PrismaService,
      UserService
    ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    consumer
    .apply(LoggerMiddleware)
    .forRoutes('*');
  }
}
