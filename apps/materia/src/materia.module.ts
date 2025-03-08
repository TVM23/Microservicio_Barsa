import { Module } from '@nestjs/common';
import { MateriaController } from './materia.controller';
import { MateriaService } from './materia.service';
import { MateriaDatabaseService } from './database/database.service';

@Module({
  imports: [MateriaDatabaseService],
  controllers: [MateriaController],
  providers: [MateriaService],
})
export class MateriaModule {}
