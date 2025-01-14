import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { Task } from 'src/data/database/task.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService){}

  private readonly tasks: Task[] = [
    {
      id:1,
      title: "Write a blog post about NestJS",
      description: "Research and write a comprehensive blog post covering the basics of NestJS framework.",
      completed: false,
      priority: "High", 

    },
    {
      id:2,
      "title": "Grocery Shopping",
      "description": "Buy milk, eggs, bread, and fruits.",
      "completed": false,
      "priority": "Medium",
    }
  ];

  createTask(body: any){
    const newUserId = this.tasks.length + 1;

    const newTask = {
      id: newUserId,
      ...body

    }
    this.tasks.push(newTask);


    return newTask;
  }

  // findAllTasks(): Task[]//This part defines the return type of the method.
  // {
  //   const allTasks = this.tasks
  // }

  async findAllTasks(){
    const allTasks = await this.prisma.task.findMany();
    return allTasks
  }

  findTaskById(id: string){
    const task = this.tasks.find(task => task.id == Number(id))

    if (task){
      return task
    }
    else{
      throw new HttpException("Tarefa não existe.", HttpStatus.NOT_FOUND)
    }
  }

  updateTask(taskId: string, body: any){

    const taskIndex = this.tasks.findIndex(task => task.id === Number(taskId))

    if(taskIndex > 0 ){
      const taskItem = this.tasks[taskIndex]
      this.tasks[taskIndex] = {
        ...taskItem,
        ...body
      }
    } else {
      throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND);
    }

    return "Tarefa atualizada com sucesso!"

  }

  deleteTask(taskId:string){

    const taskIndex = this.tasks.findIndex(task => task.id === Number(taskId))

    if(taskIndex > 0){
      this.tasks.splice(taskIndex,1)
      return
    }
    else{
      throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND);
    }

  }

}
