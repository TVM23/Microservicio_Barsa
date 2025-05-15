import * as path from 'path';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, BadRequestException, Put } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaPaginationDto, CreateMateriaDto, InventarioSalidaDTO, Roles, Role } from '@app/contracts';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'libs/cloudinary/cloudinary.service';
import { UpdateMateriaDto } from './dto/update-materia.dto';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService, private readonly cloudinaryService: CloudinaryService) {}

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
  @Roles(Role.ADMIN, Role.INVENTARIOS) 
  @UseInterceptors(AnyFilesInterceptor())
  async createMateria(
    @Body() createMateriaDto: CreateMateriaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) 
  {
    const uploaded  = await this.procesarImagenes(files);
    createMateriaDto.imagenes = uploaded;
    return this.materiaService.createMateria(createMateriaDto);
  }
  
  @Put('update-materia/:codigo')
  @Roles(Role.ADMIN, Role.INVENTARIOS) 
  @UseInterceptors(AnyFilesInterceptor())
  async updateMateria(
    @Param('codigo') codigoMat: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ){
    const uploaded  = await this.procesarImagenes(files);
    updateMateriaDto.imagenes = uploaded;
    return this.materiaService.updateMateria({codigoMat, ...updateMateriaDto})
  }

  @Delete('borrar-materia/:codigo')
  @Roles(Role.ADMIN, Role.INVENTARIOS) 
  borrarMateria(@Param('codigo') codigoMat: string) {
    return this.materiaService.borrarMateria(codigoMat);
  }

  private async procesarImagenes(files: Express.Multer.File[]): Promise<{ url: string; public_id: string }[]> {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const base64Images = files.map(file => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException(
          `Tipo de archivo no soportado: ${ext}. Solo se permiten imágenes jpg, jpeg, png y webp`,
        );      }
      return file.buffer.toString('base64');
    });
    return this.cloudinaryService.uploadBase64Images(base64Images);
  }
}
