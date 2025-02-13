import { CreateUserDto } from './../userDTO/create-user-dto';
import { Controller } from '@nestjs/common';
//classe de teste para userService

import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "../user.controller";
import { UserService } from "../user.service"
import { HashingServiceProtocol } from "src/auth/hash/bcrypt.service";
import { Test } from "@nestjs/testing";
import { create } from 'domain';

//Seguir Ordenação AAA 1- Configurar teste, algo que deseja fazer a ação e conferir se ação foi feita como foi esperada
describe ('UserService', ()=> {
  let userService : UserService;
  let userController : UserController;
  let prismaService : PrismaService;
  let hashingService : HashingServiceProtocol;

  beforeEach(async ()=>{
    const moduleRef = Test.createTestingModule({

      providers:[
        UserService,{
          provide: PrismaService,
          useValue:{
            user:{
              create: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Laura',
                email: 'laura@gmail.com'
              })
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

  it('Should add an user', async ()=>{

    //melhorar esse método
    const createUserDto: CreateUserDto = {
      username: "Laura",
      userEmail: "laura@gmail.com",
      userPassword: "meuNamoradoLindo261076**",
      userRoleAtributed:"USER"
    };

    const mockUser = {
      id: 1,
      ...createUserDto,
    };

    jest.spyOn(hashingService, 'hashing').mockResolvedValue("EU_SOU_UM_HASH")

    const result = await userService.createUser(createUserDto)

    expect(hashingService.hashing).toHaveBeenCalled()

    expect(prismaService.user.create).toHaveBeenCalledWith({
      data:{
        
      }
    })


  })

  
})