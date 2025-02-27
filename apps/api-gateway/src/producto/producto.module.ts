import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTO_CLIENT } from './constant';
import { envs } from '@app/contracts';

@Module({
  imports: [

    ClientsModule.register([
      {
        name: PRODUCTO_CLIENT,
        transport: Transport.TCP,
        options: { 
          port: envs.productoMicroservicePort,
          host: envs.productoMicroserviceHost,
        }
      }
    ])
  ],
  
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
