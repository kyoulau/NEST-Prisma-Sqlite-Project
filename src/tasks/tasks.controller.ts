import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/data/DTO/create-task.dto';
import { UpdateClassDTO } from 'src/data/DTO/update-task.dto';
import { GetTaskDto } from 'src/data/DTO/get-task.dto';
import { LoggersInterceptor } from 'src/Interceptors/log.interceptor';
import { SuccessInterceptor } from 'src/user/Interceptor/sucess-interceptor-interface';
import { AuthTokenGuar } from 'src/auth/guards/auth-token-guards';
import { PayloadTokenDto } from 'src/auth/DTO/payload-token.dto';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';

@Controller('tasks')
export class TasksController {
  constructor (private tasksService: TasksService){}

  @Post()
  @UseGuards(AuthTokenGuar)
  @UseInterceptors(SuccessInterceptor)
  @UseInterceptors(LoggersInterceptor)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @TokenPayloadParam() tokenPayload: PayloadTokenDto
  ){
    return this.tasksService.createTask(createTaskDto,tokenPayload)
  }

  // @Get()
  //  listAllTasks(): Promise<GetTaskDto[]>{
  //   return this.tasksService.findAllTasks();
  // }

  @Get()
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  async findAll(): Promise<GetTaskDto[]> {
    const tasks = await this.tasksService.findAllTasks();
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      completed: task.completed,
      createdAt: task.createdAt
    }));
  }

  @Get(':id')
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  listOneTask(@Param('id', ParseIntPipe) id:number){
    return this.tasksService.findTaskById(id);
  }

  @Patch(':id')
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  updateOneTask(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateTaskDto: UpdateClassDTO,
    tokenPayload: PayloadTokenDto
  ){
    return this.tasksService.updateTask(id,updateTaskDto,tokenPayload)
  }

  @Delete(':id')
  @UseGuards(AuthTokenGuar)
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  deleteOneTask(
    @Param('id', ParseIntPipe) id:number,
    tokenPayload: PayloadTokenDto
  )
    {
    return this.tasksService.deleteTask(id,tokenPayload)
  }

}
