import { Module } from '@nestjs/common';
import { ProductoXColorService } from './producto_x_color.service';
import { ProductoXColorController } from './producto_x_color.controller';
import { KafkaModule } from '@app/contracts';

@Module({
  imports: [
    KafkaModule
  ],
  providers: [ProductoXColorService],
  controllers: [ProductoXColorController]
})
export class ProductoXColorModule {}
