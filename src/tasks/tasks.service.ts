import { CreateTaskDto } from './../data/DTO/create-task.dto';
import { UpdateClassDTO } from 'src/data/DTO/update-task.dto';
import { TestingModule } from '@nestjs/testing';
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

  // createTask(body: any){
  //   const newUserId = this.tasks.length + 1;

  //   const newTask = {
  //     id: newUserId,
  //     ...body

  //   }
  //   this.tasks.push(newTask);


  //   return newTask;
  // }

  async createTask(createTaskDto: CreateTaskDto){
    const newTask = await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        priority: createTaskDto.priority,
        completed: false
      }
    })


    return newTask
  }

  // findAllTasks(): Task[]//This part defines the return type of the method.
  // {
  //   const allTasks = this.tasks
  // }

  async findAllTasks(){
    const allTasks = await this.prisma.task.findMany();
    return allTasks;
  }

  // findTaskById(id: string){
  //   const task = this.tasks.find(task => task.id == Number(id))

  //   if (task){
  //     return task
  //   }
  //   else{
  //     throw new HttpException("Tarefa não existe.", HttpStatus.NOT_FOUND)
  //   }
  // }

  // faz o DTO sua vagaba 

  async findTaskById(id: number){

    const taskItem = await this.prisma.task.findFirst({
      where: {
        id:id
      }
    })

    if(taskItem?.title){
      return taskItem
    }else{
      throw new HttpException("Tarefa não existe.", HttpStatus.NOT_FOUND)
    }

  }

  // updateTask(id: string, body: any){

  //   const taskIndex = this.tasks.findIndex(task => task.id === Number(id))

  //   if(taskIndex > 0 ){
  //     const taskItem = this.tasks[taskIndex]
  //     this.tasks[taskIndex] = {
  //       ...taskItem,
  //       ...body
  //     }
  //   } else {
  //     throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND);
  //   }

  //   return "Tarefa atualizada com sucesso!"

  // }

  async updateTask(id: number, updateTaskDto: UpdateClassDTO){

    const taskItemForEdit = await this.prisma.task.findFirst({
      where: {
        id:id
      }
    })

    if(taskItemForEdit?.title){
      const newTask = await this.prisma.task.update({
        where: {
          id: taskItemForEdit.id
        },
        data: updateTaskDto
      })

      return newTask

    }else{
      throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
    }

  }

  // deleteTask(id:string){

  //   const taskIndex = this.tasks.findIndex(task => task.id === Number(id))

  //   if(taskIndex > 0){
  //     this.tasks.splice(taskIndex,1)
  //     return
  //   }
  //   else{
  //     throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND);
  //   }

  // }

   async deleteTask(id: number){

    const taskItemForDelete = await this.prisma.task.findFirst({
      where:{
        id:id
      }
    })

    if(taskItemForDelete?.title){

       await this.prisma.task.delete({
        where: {
          id: taskItemForDelete.id
        }
      })

      return {
        message: "Tarefa foi excluida com sucesso !"
      }

      // No futuro, ao invés de escluir a tarefa, irá popular no banco um novo campo "deletedAt de task que será preenchido com a data que a tarefa foi ""excluida", mantendo
      // Mantendo os dados integros.

    } else {
      throw new HttpException("Tarefa não existe!", HttpStatus.NOT_FOUND)
    }

  }

}
