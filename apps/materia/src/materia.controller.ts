import { Controller, Get } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MessagePattern } from '@nestjs/microservices';
import { MATERIA_PATTERNS } from 'libs/contracts/materia/materia.patterns';
import { MateriaPaginationDto } from '@app/contracts';

@Controller()
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @MessagePattern(MATERIA_PATTERNS.GET_LISTADO_MATERIA)
  async getListadoMateria(materiaPaginationDto: MateriaPaginationDto){
    return await this.materiaService.getListadoMateria(materiaPaginationDto)
  }
}
