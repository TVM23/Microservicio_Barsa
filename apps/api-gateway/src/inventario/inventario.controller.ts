import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MovimientoMateriaDto, MovimientoMateriaPagiDto, MovimientoProductoPagiDto, MovimientosDto, Role, Roles } from '@app/contracts';
import { InventarioService } from './inventario.service';
import { GetCurrentUserName } from '../user-authentication/common/decorators/get-current-user-name.decorator';

@Controller('inventario')
export class InventarioController {
    constructor(private readonly inventarioService: InventarioService) {}

    @Get('materia/movimiento-listado')
    async getListadoMovimientoMateria(@Query() paginationDTO: MovimientoMateriaPagiDto) {
        return await this.inventarioService.getListadoMovimientoMateria(paginationDTO);
    }

    @Get('producto/movimiento-listado')
    async getListadoMovimientoProducto(@Query() paginationDTO: MovimientoProductoPagiDto) {
        return await this.inventarioService.getListadoMovimientoProducto(paginationDTO);
    }

    @Post('materia/movimiento')
    @Roles(Role.INVENTARIOS)
    async createMovimientoMateria(
        @Body() movimientoMateriaDto: MovimientoMateriaDto,
        @GetCurrentUserName() usuario: string,
    ){
        return await this.inventarioService.createMovimientoMateria({usuario, ...movimientoMateriaDto});
    }

    @Post('producto/movimiento')
    @Roles(Role.INVENTARIOS)
    async createMovimientoProducto(
        @Body() movimientoDto: MovimientosDto,
        @GetCurrentUserName() usuario: string,
    ){
        return await this.inventarioService.createMovimientoProducto({usuario, ...movimientoDto});
    }
}
