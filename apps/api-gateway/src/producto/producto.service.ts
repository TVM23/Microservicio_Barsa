import { Inject, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PRODUCTO_CLIENT } from './constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PRODUCTO_PATTERNS } from '@app/contracts';

@Injectable()
export class ProductoService {
  constructor(@Inject(PRODUCTO_CLIENT) private readonly productoClient: ClientProxy){}

  getProductos(){
      return this.productoClient.send(PRODUCTO_PATTERNS.LISTADO_PRODUCTOS, { })
      .pipe(
          catchError( err => { throw new RpcException(err) } )
      );
  }
  
  create(createProductoDto: CreateProductoDto) {
    return 'This action adds a new producto';
  }

  findAll() {
    return `This action returns all producto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
