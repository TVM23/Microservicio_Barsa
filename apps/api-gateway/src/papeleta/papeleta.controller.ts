import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PapeletaPaginationDto, Role } from '@app/contracts';
import { PapeletaService } from './papeleta.service';
import { CreatePapeletaDto } from './dto/create-papeleta.dto';
import { UpdatePapeletaDto } from './dto/update-papeleta.dto';
import { Roles } from '../user-authentication/common/decorators';

@Controller('papeleta')
export class PapeletaController {
  constructor(private readonly papeletaService: PapeletaService) {}

  @Get('get-listado-papeletas')
  async getListadoPapeletas(@Query() papeletaPaginationDto: PapeletaPaginationDto){
    return await this.papeletaService.getListadoPapeletas(papeletaPaginationDto)
  }

  @Get(':folio')
  async getPapeletaPorFolio(@Param('folio') folio: number){
    return await this.papeletaService.getPapeletaPorFolio(folio)
  }

  @Post()
  create(@Body() createPapeletaDto: CreatePapeletaDto) {
    return this.papeletaService.create(createPapeletaDto);
  }

  @Get()
  findAll() {
    return this.papeletaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.papeletaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePapeletaDto: UpdatePapeletaDto) {
    return this.papeletaService.update(+id, updatePapeletaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.papeletaService.remove(+id);
  }
}
