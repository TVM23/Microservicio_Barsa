import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTO_CLIENT } from './constant';
import { envs, KafkaModule } from '@app/contracts';

@Module({
  imports: [
    KafkaModule
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
