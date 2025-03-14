import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { MateriaPaginationDto } from '@app/contracts';
import { firstValueFrom } from 'rxjs';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Get('get-listado')
  async getListadoMateria(){
    return await this.materiaService.getListadoMateria();
  }

  @Get('get-listado-materia')
  async getListadoMateriaFiltro(@Query() dtoMateriaPaginado: MateriaPaginationDto){
    return await this.materiaService.getListadoMateriaFiltro(dtoMateriaPaginado);
  }

  @Get(':codigo')
  async getMateriaPorCodigo(@Param('codigo') codigo: string){
    return await this.materiaService.getMateriaPorCodigo(codigo);
  }

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll() {
    return this.materiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.materiaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiaService.update(+id, updateMateriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.materiaService.remove(+id);
  }
}
