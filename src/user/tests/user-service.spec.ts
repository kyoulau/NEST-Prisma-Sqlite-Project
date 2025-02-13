import { CreateUserDto } from './../userDTO/create-user-dto';
import { Controller, HttpException, HttpStatus } from '@nestjs/common';
//classe de teste para userService

import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "../user.controller";
import { UserService } from "../user.service"
import { HashingServiceProtocol } from "src/auth/hash/bcrypt.service";
import { Test } from "@nestjs/testing";
import { create } from 'domain';
import { find } from 'rxjs';
import { Task } from 'src/data/database/task.entity';

//Seguir Ordenação AAA 1- Configurar teste, algo que deseja fazer a ação e conferir se ação foi feita como foi esperada
describe ('UserService', ()=> {
  let userService : UserService;
  let userController : UserController;
  let prismaService : PrismaService;
  let hashingService : HashingServiceProtocol;
  let userID: 0

  beforeEach(async ()=>{
    const moduleRef = Test.createTestingModule({

      providers:[
        UserService,{
          provide: PrismaService,
          useValue:{
            user:{
              create: jest.fn().mockResolvedValue({

                username: 'Lauta teste unitario',
                userEmail: 'testeunitario@gmail.com',
                userRoleAtributed: 'USER'
              }),
              findFirst:jest.fn()
              
            }
          }
        },
        PrismaService,{
          provide: HashingServiceProtocol,
          useValue: {
            hashing: jest.fn,
            compare: jest.fn()
          },
        }
      ]
    }).compile()

    userService = (await moduleRef).get<UserService>(UserService)
    prismaService = (await moduleRef).get<PrismaService>(PrismaService)
    hashingService = (await moduleRef).get<HashingServiceProtocol>(HashingServiceProtocol)
  })

  it('Should be returned', async ()=> {
    expect(userService).toBeDefined();
  })

  describe('Create User', ()=>{

    it('Should add an user', async ()=>{

      const createUserDTO: CreateUserDto = {
        username: 'Lauta teste unitario',
        userEmail: 'testeunitario@gmail.com',
        userPassword: 'HASHING_SENHA',
        userRoleAtributed: 'USER'
      }
  
      //hash é gerado
      const HASHING_SENHA = jest.spyOn(hashingService,'hashing').mockResolvedValue("HASH_SENHA")
           
       //cria novo usuário no prisma com dados do dto
      let result = await  userService.createUser(createUserDTO)
      console.log(result)
  
      expect(HASHING_SENHA).toHaveBeenCalled()
  
        //testar o retorno da função
        expect(result).toEqual({
          id: expect.any(Number),
          username: createUserDTO.username,
          userEmail: createUserDTO.userEmail
        })
    })
  })

  describe('Get User by id', ()=>{
    it('Should return one user by ID', async ()=>{

      //MOck usuario para ser encontrado.
      const mockUserForFind = {
        id: 68,
        username: 'jungkookThePlayBoy',
        userEmail: 'jungkook@gmail.com',
        active: true,
        userPassword: 'senhaUsuarioMaluco02**',
        createdAt: new Date(),
        userRoleAtributed: 'USER',
        Task: [],
        avatar: ''
      }
  
      //mock para findFirst
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUserForFind)

      const result = await userService.getUserById(68)

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where:{
          id:68,
        },
        select:{
          id:true,
          userEmail:true,
          username:true,
          active:true,
          createdAt:true,
          userRoleAtributed:true,
          avatar:true,
          userPassword:true
        }
      })

      expect(result).toEqual(mockUserForFind)
  
    })

    it('Should throw an error if user is not found', async ()=>{
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null)

      await expect(userService.getUserById(68)).rejects.toThrow(
        new HttpException("Usuário não encontrado!",HttpStatus.NOT_FOUND)
      )
    })
  })
  
})