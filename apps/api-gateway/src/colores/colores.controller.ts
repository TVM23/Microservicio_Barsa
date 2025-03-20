import { Controller, Get, Query } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { ColoresPaginationDto } from 'libs/contracts/colores/colores-paginarion.dto';

@Controller('colores')
export class ColoresController {
    constructor(private readonly coloresService: ColoresService){}

    @Get('get-colores-listado')
    async getColoresListado(@Query() coloresPaginationDto: ColoresPaginationDto){
        return await this.coloresService.getColoresListado(coloresPaginationDto)
    }
}
