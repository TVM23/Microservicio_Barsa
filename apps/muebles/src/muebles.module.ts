import { Module } from '@nestjs/common';
import { MueblesController } from './muebles.controller';
import { MueblesService } from './muebles.service';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [DatabaseService],
  controllers: [MueblesController],
  providers: [MueblesService],
})
export class MueblesModule {}
