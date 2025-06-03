import { Module } from '@nestjs/common';
import { NotificacionController } from './notificacion.controller';
import { NotificacionService } from './notificacion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificacionSchema } from './schema/notificacion.schema';
import { KafkaModule } from '@app/contracts';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notificacion', schema: NotificacionSchema },
    ]),
    HttpModule,
    //KafkaModule,
  ],
  controllers: [NotificacionController],
  providers: [NotificacionService]
})
export class NotificacionModule {}
