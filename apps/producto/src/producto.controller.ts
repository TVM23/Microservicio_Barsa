import { Controller } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PRODUCTO_PATTERNS } from '@app/contracts';

@Controller()
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @MessagePattern(PRODUCTO_PATTERNS.LISTADO_PRODUCTOS)
  async getProductos(){
    return await this.productoService.getProductos()
  }
}
