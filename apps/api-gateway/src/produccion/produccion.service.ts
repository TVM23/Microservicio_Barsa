import { DesactivarDetencionDto, DetencionDto, FinalizarTiempoDto, IniciarTiempoDto, KafkaPublisherService, PausarTiempoDto, ReiniciarTiempoDto, TiemposFechaBusquedaDto } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { TiempoDto } from 'libs/contracts/produccion/tiempo.dto';

@Injectable()
export class ProduccionService {
    constructor(private readonly kafkaService: KafkaPublisherService) {}

    iniciarTiempo(iniciarTiempoDto: IniciarTiempoDto) {
        return this.kafkaService.sendRequest('post-iniciar-tiempo', iniciarTiempoDto)
    }

    detenerTiempo(detenerTiempoDto: DetencionDto) {
        return this.kafkaService.sendRequest('post-detencion-tiempo', detenerTiempoDto)
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

    desactivarDetencion(desactivarDetencionDto: DesactivarDetencionDto){
        return this.kafkaService.sendRequest('put-desactivar-detencion', desactivarDetencionDto)
    }

    obtenerTiempo(tiempoDto: TiempoDto){
        return this.kafkaService.sendRequest('get-registro-tiempo', tiempoDto)
    }
    
    obtenerDetencion(tiempoDto: TiempoDto){
        return this.kafkaService.sendRequest('get-registro-detencion', tiempoDto)
    }

    obtenerTiemposFolio(procesoFolio: number){
        return this.kafkaService.sendRequest('get-tiempos-folio', procesoFolio)
    }

    obtenerUltimaDetencionActiva(procesoFolio: number){
        return this.kafkaService.sendRequest('get-ultima-detencion', procesoFolio)
    }

    obtenerDetencionesFolio(procesoFolio: number){
        return this.kafkaService.sendRequest('get-detenciones-folio', procesoFolio)
    }

    obtenerTiemposPeriodo(dto: TiemposFechaBusquedaDto){
        return this.kafkaService.sendRequest('get-tiempos-periodo', dto)
    }
}
