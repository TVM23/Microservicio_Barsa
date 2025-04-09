import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { MateriaPaginationDto, CreateMateriaDto } from '@app/contracts';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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

  @Post('crear-materia')
  @UseInterceptors(AnyFilesInterceptor()) // Para recibir cualquier archivo
  createMateria(
    @Body() createMateriaDto: CreateMateriaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (files && files.length > 0) {
      createMateriaDto.imagenes = files.map(file => file.buffer.toString('base64'));
    } else {
      createMateriaDto.imagenes = [];
    }
    return this.materiaService.createMateria(createMateriaDto);
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
