import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductoService {
  constructor(@Inject('ODBC_CONNECTION') private readonly dbConection) {}

  async getProductos(){
    try {
      return await this.dbConection.query('SELECT * FROM Producto');
    } catch (error) {
      throw new RpcException({
        message: `Error en la base de datos`,
        error: 'Unauthorized',
        status: 403
      });
    }
  }
}
