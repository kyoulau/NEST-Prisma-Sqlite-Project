import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from 'src/tasks/tasks.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaService],
  providers: [UserService],
  controllers: [UserController]
})
export class UserModule {}
