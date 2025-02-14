import { Module } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAuthenticationController } from './user-authentication.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '@app/contracts';
import { USERS_CLIENT } from './constant';

@Module({
  imports: [

    ClientsModule.register([
        {
          name: USERS_CLIENT,
          transport: Transport.TCP,
          options: { 
            port: envs.usuariosMicroservicePort,
            host: envs.usuariosMicroserviceHost,
          }
        }
      ])
    ],
    
  providers: [UserAuthenticationService],
  controllers: [UserAuthenticationController]
})
export class UserAuthenticationModule {}
