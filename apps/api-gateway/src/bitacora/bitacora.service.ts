import { BitacoraInvPaginationDto, BitacoraProdPaginationDto, KafkaPublisherService } from '@app/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BitacoraService {
    constructor(private readonly kafkaService: KafkaPublisherService){}

    async getListadoBitacoraInventario(bitacoraInvPaginationDto: BitacoraInvPaginationDto){
        return await this.kafkaService.sendRequest('get-bitacora-inventario', bitacoraInvPaginationDto)
    }

    async getListadoBitacoraProduccion(bitacoraProdPaginationDto: BitacoraProdPaginationDto){
        return await this.kafkaService.sendRequest('get-bitacora-produccion', bitacoraProdPaginationDto)
    }
}
