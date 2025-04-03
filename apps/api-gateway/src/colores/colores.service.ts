import { CreateColorDto, KafkaPublisherService } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { ColoresPaginationDto } from 'libs/contracts/colores/colores-paginarion.dto';

@Injectable()
export class ColoresService {
    constructor(private kafkaService: KafkaPublisherService){}

    getColoresListado(coloresPaginationDto: ColoresPaginationDto){
        return this.kafkaService.sendRequest('get-colores-listado', coloresPaginationDto)
    }

    getColorPorId(colorId: number){
        return this.kafkaService.sendRequest('get-colorId-codigo', colorId)
    }

    crearNuevoColor(createColor: CreateColorDto ){
        return this.kafkaService.sendRequest('post-color-crear', createColor)
    }
}
