import { Module } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaController } from './materia.controller';
import { MATERIA_CLIENT } from './constant';
import { KafkaModule } from '@app/contracts'; 
import { CloudinaryService } from 'libs/cloudinary/cloudinary.service';

@Module({
  imports: [
    KafkaModule,
    ],
  controllers: [MateriaController],
  providers: [MateriaService, CloudinaryService],
})
export class MateriaModule {}
