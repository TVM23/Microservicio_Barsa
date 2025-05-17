import { FinalizarTiempoDto, IniciarTiempoDto, KafkaPublisherService, PausarTiempoDto, ReiniciarTiempoDto } from '@app/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProduccionService {
    constructor(private readonly kafkaService: KafkaPublisherService) {}

    iniciarTiempo(iniciarTiempoDto: IniciarTiempoDto) {
        return this.kafkaService.sendRequest('post-iniciar-tiempo', iniciarTiempoDto)
    }

    pausarTiempo(pausarTiempoDto: PausarTiempoDto) {
        return this.kafkaService.sendRequest('put-pausar-tiempo', pausarTiempoDto)
    }

    reiniciarTiempo(reiniciarTiempoDto: ReiniciarTiempoDto) {
        return this.kafkaService.sendRequest('put-reiniciar-tiempo', reiniciarTiempoDto)
    }

    finalizarTiempo(finalizarTiempoDto: FinalizarTiempoDto) {
        return this.kafkaService.sendRequest('put-finalizar-tiempo', finalizarTiempoDto)
    }
}
