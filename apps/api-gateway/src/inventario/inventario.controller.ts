import { Body, Controller, Post } from '@nestjs/common';
import { InventarioEntradaDTO, InventarioSalidaDTO } from '@app/contracts';
import { InventarioService } from './inventario.service';
import { GetCurrentUserName } from '../user-authentication/common/decorators/get-current-user-name.decorator';

@Controller('inventario')
export class InventarioController {
    constructor(private readonly inventarioService: InventarioService) {}

    @Post('crear-salida-nueva')
    async createSalidaInventario(
        @Body() crearFichaDto: InventarioSalidaDTO,
        @GetCurrentUserName() createdBy: string,
    ) {
        return await this.inventarioService.createSalidaInventario({createdBy, ...crearFichaDto});
    }

    @Post('crear-entrada-nueva')
    async createEntradaInventario(
        @Body() crearFichaDto: InventarioEntradaDTO,
        @GetCurrentUserName() createdBy: string,
    ){
        return await this.inventarioService.createEntradaInventario({createdBy, ...crearFichaDto});
    }
}
