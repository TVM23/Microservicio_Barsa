import { Module } from '@nestjs/common';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAuthenticationController } from './user-authentication.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '@app/contracts';
import { USERS_CLIENT } from './constant';
import { AtStrategy, RtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
      ]),
      PassportModule, JwtModule, JwtModule.register({})
    ],
    
  providers: [UserAuthenticationService, AtStrategy, RtStrategy],
  controllers: [UserAuthenticationController]
})
export class UserAuthenticationModule {}
