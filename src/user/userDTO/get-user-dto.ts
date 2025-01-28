import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user-dto";

export class GetUserDto extends PickType(CreateUserDto,['username', 'userEmail','userPassword','userRoleAtributed']){

  readonly createdAt: Date
}