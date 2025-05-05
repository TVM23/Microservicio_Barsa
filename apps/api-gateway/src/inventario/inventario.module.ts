import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { KafkaModule } from '@app/contracts';

@Module({
  imports: [KafkaModule],
  providers: [InventarioService],
  controllers: [InventarioController]
})
export class InventarioModule {}
