import { Module } from '@nestjs/common';
import { ProductoController } from './producto.controller';
import { ProductoService } from './producto.service';
import { ProductoDatabaseService } from './database/database.service';

@Module({
  imports: [ProductoDatabaseService],
  controllers: [ProductoController],
  providers: [ProductoService],
})
export class ProductoModule {}
