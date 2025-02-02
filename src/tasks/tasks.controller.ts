import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/data/DTO/create-task.dto';
import { UpdateClassDTO } from 'src/data/DTO/update-task.dto';
import { GetTaskDto } from 'src/data/DTO/get-task.dto';
import { LoggersInterceptor } from 'src/Interceptors/log.interceptor';
import { SuccessInterceptor } from 'src/user/Interceptor/sucess-interceptor-interface';

@Controller('tasks')
export class TasksController {
  constructor (private tasksService: TasksService){}

  @Post()
  @UseInterceptors(SuccessInterceptor)
  @UseInterceptors(LoggersInterceptor)
  createTask(@Body() createTaskDto: CreateTaskDto){
    return this.tasksService.createTask(createTaskDto)
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
  updateOneTask(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateClassDTO){
    return this.tasksService.updateTask(id,updateTaskDto)
  }

  @Delete(':id')
  @UseInterceptors(LoggersInterceptor)
  @UseInterceptors(SuccessInterceptor)
  deleteOneTask(@Param('id', ParseIntPipe) id:number){
    return this.tasksService.deleteTask(id)
  }

}
