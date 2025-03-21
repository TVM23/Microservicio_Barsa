import { Controller, Get, Query } from '@nestjs/common';
import { ProductoXColorService } from './producto_x_color.service';
import { ProdxColorPafinationDto } from '@app/contracts';

@Controller('producto-x-color')
export class ProductoXColorController {
    constructor(private readonly prodXcolorService: ProductoXColorService){}

    @Get('get-prodXcolor-listado')
    async getListado(@Query() prodXcolorPaginationDto: ProdxColorPafinationDto){
        return await this.prodXcolorService.getListado(prodXcolorPaginationDto)
    }
}
