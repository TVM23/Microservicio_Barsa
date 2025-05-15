import { Module } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { ProduccionController } from './produccion.controller';
import { KafkaModule } from '@app/contracts';

@Module({
  imports: [
    KafkaModule
  ],
  providers: [ProduccionService],
  controllers: [ProduccionController]
})
export class ProduccionModule {}
