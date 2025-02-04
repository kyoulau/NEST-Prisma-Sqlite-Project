import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hash/bcrypt.service';
import { BCryptHashService } from './hash/hashing.service';

@Global()
@Module({
  providers:[
   {
    provide: HashingServiceProtocol,
    useClass: BCryptHashService
   }
  ],
  exports:[
   HashingServiceProtocol
  ]

})
export class AuthModule {}
