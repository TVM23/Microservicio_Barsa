import { IniciarTiempoDto, KafkaPublisherService } from '@app/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProduccionService {
    constructor(private readonly kafkaService: KafkaPublisherService) {}

    iniciarTiempo(iniciarTiempoDto: IniciarTiempoDto) {
        return this.kafkaService.sendRequest('post-iniciar-tiempo', iniciarTiempoDto)
    }
}
