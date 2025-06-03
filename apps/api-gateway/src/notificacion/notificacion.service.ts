import { KafkaPublisherService } from '@app/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificacionService {
    constructor(private readonly kafkaService: KafkaPublisherService){}

    getListadoNotificaciones(){
        return this.kafkaService.sendRequest('get-notificaciones', "");
    }
}
