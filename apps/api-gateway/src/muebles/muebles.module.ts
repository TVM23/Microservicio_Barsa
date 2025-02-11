import { Module } from '@nestjs/common';
import { MueblesService } from './muebles.service';
import { MueblesController } from './muebles.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MUEBLES_CLIENT } from './constant'
import { envs } from '@app/contracts';

@Module({

  imports: [
    ClientsModule.register([
      {
        name: MUEBLES_CLIENT,
        transport: Transport.TCP,
        options: { 
          port: envs.mueblesMicroservicePort,
          host: envs.mueblesMicroserviceHost,
        }
      }
    ])
  ],

  providers: [MueblesService],
  controllers: [MueblesController]
})
export class MueblesModule {}
