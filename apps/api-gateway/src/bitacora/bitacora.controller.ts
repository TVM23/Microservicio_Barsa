import { Controller, Get, Query } from '@nestjs/common';
import { BitacoraService } from './bitacora.service';
import { BitacoraInvPaginationDto, BitacoraProdPaginationDto, Role, Roles } from '@app/contracts';

@Controller('bitacora')
export class BitacoraController {
    constructor(private readonly bitacoraService: BitacoraService){}

    @Get('listado-inventario')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    async getListadoBitacoraInventario(@Query() bitacoraInvPaginationDto: BitacoraInvPaginationDto ){
        return await this.bitacoraService.getListadoBitacoraInventario(bitacoraInvPaginationDto)
    }

    @Get('listado-produccion')
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    async getListadoBitacoraProduccion(@Query() bitacoraProdPaginationDto: BitacoraProdPaginationDto ){
        return await this.bitacoraService.getListadoBitacoraProduccion(bitacoraProdPaginationDto)
    }
}
