import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ProductoPaginationDto } from '@app/contracts';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get('get-productos-listado')
  async getProductos(@Query() productoPaginationDto: ProductoPaginationDto){
    return await this.productoService.getProductos(productoPaginationDto)
  }

  @Get(':codigo')
  async getProductoByCodigo(@Param('codigo') codigo: string){
    return await this.productoService.getProductoByCodigo(codigo)
  }
  
}
