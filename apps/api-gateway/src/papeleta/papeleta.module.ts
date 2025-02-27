import { Module } from '@nestjs/common';
import { PapeletaService } from './papeleta.service';
import { PapeletaController } from './papeleta.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PAPELETA_CLIENT } from './constant';
import { envs } from '@app/contracts';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PAPELETA_CLIENT,
        transport: Transport.TCP,
        options: { 
          port: envs.papeletaMicroservicePort,
          host: envs.papeletaMicroserviceHost,
        }
      }
    ])
  ],
  controllers: [PapeletaController],
  providers: [PapeletaService],
})
export class PapeletaModule {}
