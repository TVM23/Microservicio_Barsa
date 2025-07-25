import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ColoresService } from './colores.service';
import { ColoresPaginationDto } from 'libs/contracts/colores/colores-paginarion.dto';
import { CreateColorDto, Role, Roles } from '@app/contracts';

@Controller('colores')
export class ColoresController {
    constructor(private readonly coloresService: ColoresService){}

    @Get('get-colores-listado')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INVENTARIOS) 
    async getColoresListado(@Query() coloresPaginationDto: ColoresPaginationDto){
        return await this.coloresService.getColoresListado(coloresPaginationDto)
    }

    @Get(':colorId')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INVENTARIOS) 
    async getColorPorId(@Param('colorId') colorId: number){
        return await this.coloresService.getColorPorId(colorId)
    }

    @Post('nuevo-color')
    @Roles(Role.INVENTARIOS) 
    async crearNuevoColor(@Body() createColor: CreateColorDto ){
        return await this.coloresService.crearNuevoColor(createColor)
    }
}
