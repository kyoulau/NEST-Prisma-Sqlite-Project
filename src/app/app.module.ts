import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from 'src/data/database/task.entity';
import { User } from 'src/data/database/user.entity';
import { TasksController } from 'src/tasks/tasks.controller';
import { TasksService } from 'src/tasks/tasks.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'sqlite',
      database:'src/database/dev.db',
      entities: [Task, User],
      synchronize: true
    })
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService, PrismaService],
})
export class AppModule {}
