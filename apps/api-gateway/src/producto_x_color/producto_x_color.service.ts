import { KafkaPublisherService, ProdxColorPafinationDto } from '@app/contracts';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductoXColorService {
    constructor(private kafkaModule: KafkaPublisherService){}

    getListado(prodXcolorPaginationDto: ProdxColorPafinationDto){
        return this.kafkaModule.sendRequest('get-prodXcolor-listado', prodXcolorPaginationDto)
    }
}
