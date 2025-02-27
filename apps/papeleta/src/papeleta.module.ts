import { Module } from '@nestjs/common';
import { PapeletaController } from './papeleta.controller';
import { PapeletaService } from './papeleta.service';
import { PapeletaDatabaseService } from './database/database.service';

@Module({
  imports: [PapeletaDatabaseService],
  controllers: [PapeletaController],
  providers: [PapeletaService, ],
})
export class PapeletaModule {}
