import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor (private tasksService: TasksService){}

  @Post()
  createTask(@Body() body: any){
    console.log(body)
    return this.tasksService.createTask(body)
  }

  @Get()
  listAllTasks(){
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  listOneTask(@Param('id') id:string){
    return this.tasksService.findTaskById(id);
  }

  @Patch()
  updateOneTask(@Param('taskId') taskId: string, @Body() body: any){
    return this.tasksService.updateTask(taskId,body)
  }

  @Delete()
  deleteOneTask(@Param('taskId')taskId:string){
    return this.tasksService.deleteTask(taskId)
  }

}
