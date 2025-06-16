import { Controller, Get, Query } from '@nestjs/common';
import { ProductoXColorService } from './producto_x_color.service';
import { ProdxColorPafinationDto, Role, Roles } from '@app/contracts';

@Controller('producto-x-color')
export class ProductoXColorController {
    constructor(private readonly prodXcolorService: ProductoXColorService){}

    @Get('get-prodXcolor-listado')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INVENTARIOS) 
    async getListado(@Query() prodXcolorPaginationDto: ProdxColorPafinationDto){
        return await this.prodXcolorService.getListado(prodXcolorPaginationDto)
    }
}
