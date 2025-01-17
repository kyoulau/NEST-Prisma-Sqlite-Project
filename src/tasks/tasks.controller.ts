import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from 'src/data/DTO/create-task.dto';
import { UpdateClassDTO } from 'src/data/DTO/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor (private tasksService: TasksService){}

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto){
    return this.tasksService.createTask(createTaskDto)
  }

  @Get()
  listAllTasks(){
    return this.tasksService.findAllTasks();
  }

  @Get(':id')
  listOneTask(@Param('id', ParseIntPipe) id:number){
    return this.tasksService.findTaskById(id);
    // Conversao do pipe feito na propria requisição. Id começa como string mas e transformado pelo pipe para ser number
  }

  @Patch(':id')
  updateOneTask(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateClassDTO){
    return this.tasksService.updateTask(id,updateTaskDto)
  }

  @Delete(':id')
  deleteOneTask(@Param('id', ParseIntPipe) id:number){
    return this.tasksService.deleteTask(id)
  }

}
