import { Module } from '@nestjs/common';
import { BitacoraService } from './bitacora.service';
import { BitacoraController } from './bitacora.controller';
import { KafkaModule } from '@app/contracts';

@Module({
  imports: [
    KafkaModule
  ],
  providers: [BitacoraService],
  controllers: [BitacoraController]
})
export class BitacoraModule {}
