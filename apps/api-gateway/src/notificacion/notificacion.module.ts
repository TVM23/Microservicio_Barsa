import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { KafkaModule } from '@app/contracts';

@Module({
  imports: [
      KafkaModule,
      ],
  providers: [NotificacionService],
  controllers: [NotificacionController]
})
export class NotificacionModule {}
