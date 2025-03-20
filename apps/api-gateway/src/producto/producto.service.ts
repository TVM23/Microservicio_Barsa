import { Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { KafkaPublisherService, PRODUCTO_PATTERNS, ProductoPaginationDto } from '@app/contracts';

@Injectable()
export class ProductoService {
  constructor(private readonly kafkaService: KafkaPublisherService){}

  getProductos(productoPaginationDto: ProductoPaginationDto){
      return this.kafkaService.sendRequest('get-producto-listado', productoPaginationDto)
  }

  getProductoByCodigo(codigo: string){
    return this.kafkaService.sendRequest('get-producto-codigo', codigo)
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
