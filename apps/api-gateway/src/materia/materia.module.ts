import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MATERIA_CLIENT } from './constant';
import { envs } from '@app/contracts';
import { KafkaModule } from '@app/contracts';  // 👈 Importar KafkaModule

@Module({
  imports: [
    KafkaModule,
    ],
  controllers: [MateriaController],
  providers: [MateriaService],
})
export class MateriaModule {}
