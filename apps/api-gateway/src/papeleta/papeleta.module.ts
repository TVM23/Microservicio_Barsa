import { Module } from '@nestjs/common';
import { PapeletaService } from './papeleta.service';
import { PapeletaController } from './papeleta.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PAPELETA_CLIENT } from './constant';
import { envs, KafkaModule } from '@app/contracts';

@Module({
  imports: [
    KafkaModule
  ],
  controllers: [PapeletaController],
  providers: [PapeletaService],
})
export class PapeletaModule {}
