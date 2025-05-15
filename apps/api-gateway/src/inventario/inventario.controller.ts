import { Body, Controller, Get, Post } from '@nestjs/common';
import { InventarioEntradaDTO, InventarioEntradasPaginationDto, InventarioSalidaDTO, InventarioSalidasPaginationDto, Role, Roles } from '@app/contracts';
import { InventarioService } from './inventario.service';
import { GetCurrentUserName } from '../user-authentication/common/decorators/get-current-user-name.decorator';

@Controller('inventario')
export class InventarioController {
    constructor(private readonly inventarioService: InventarioService) {}

    @Get('get-listado-entradas')
    async getEntradasInventario(@Body() paginationDTO: InventarioEntradasPaginationDto) {
        return await this.inventarioService.getEntradasInventario(paginationDTO);
    }

    @Get('get-listado-salidas')
    async getSalidasInventario(@Body() paginationDTO: InventarioSalidasPaginationDto) {
        return await this.inventarioService.getSalidasInventario(paginationDTO);
    }

    @Post('crear-salida-nueva')
    @Roles(Role.ADMIN, Role.INVENTARIOS) 
    async createSalidaInventario(
        @Body() crearFichaDto: InventarioSalidaDTO,
        @GetCurrentUserName() createdBy: string,
    ) {
        return await this.inventarioService.createSalidaInventario({createdBy, ...crearFichaDto});
    }

    @Post('crear-entrada-nueva')
    @Roles(Role.ADMIN, Role.INVENTARIOS) 
    async createEntradaInventario(
        @Body() crearFichaDto: InventarioEntradaDTO,
        @GetCurrentUserName() createdBy: string,
    ){
        return await this.inventarioService.createEntradaInventario({createdBy, ...crearFichaDto});
    }
}
