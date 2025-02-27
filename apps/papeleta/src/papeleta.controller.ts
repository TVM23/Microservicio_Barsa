import { Controller, Get } from '@nestjs/common';
import { PapeletaService } from './papeleta.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PAPELETA_PATTERNS, PapeletaPaginationDto } from '@app/contracts';

@Controller()
export class PapeletaController {
  constructor(private readonly papeletaService: PapeletaService) {}

  @MessagePattern(PAPELETA_PATTERNS.GET_LISTADO_PAPELETAS)
  async getListadoPapeletas(@Payload() papeletaPaginationDto: PapeletaPaginationDto){
    return await this.papeletaService.getListadoPapeletas(papeletaPaginationDto)
  }
}
