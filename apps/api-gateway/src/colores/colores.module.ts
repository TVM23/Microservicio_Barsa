import { Module } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { ColoresController } from './colores.controller';
import { KafkaModule } from '@app/contracts';

@Module({
  imports: [
    KafkaModule
  ],
  providers: [ColoresService],
  controllers: [ColoresController]
})
export class ColoresModule {}
