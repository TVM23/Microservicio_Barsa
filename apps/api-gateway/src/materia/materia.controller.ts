import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, BadRequestException, Put } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaPaginationDto, CreateMateriaDto } from '@app/contracts';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
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
  @UseInterceptors(AnyFilesInterceptor())
  async createMateria(
    @Body() createMateriaDto: CreateMateriaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) 
  {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const base64Images = files.map(file => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException(
          `Tipo de archivo no soportado: ${ext}. Solo se permiten imágenes`,
        );
      }
      return file.buffer.toString('base64');
    });
    // Subir a Cloudinary
    const uploaded  = await this.cloudinaryService.uploadBase64Images(base64Images);

    // Guardar las URLs en el DTO
    createMateriaDto.imagenes = uploaded;

    // Mandar solo el DTO con URLs por Kafka
    return this.materiaService.createMateria(createMateriaDto);
  }
  
  @Put('update-materia/:codigo')
  @UseInterceptors(AnyFilesInterceptor())
  async updateMateria(
    @Param('codigo') codigoMat: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ){
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    const base64Images = files.map(file => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        throw new BadRequestException(`Archivo no soportado: ${ext}`);
      }
      return file.buffer.toString('base64');
    });
  
    const uploaded  = await this.cloudinaryService.uploadBase64Images(base64Images);
    updateMateriaDto.imagenes = uploaded;
    return this.materiaService.updateMateria({codigoMat, ...updateMateriaDto})
  }

  @Delete('borrar-materia/:codigo')
  borrarMateria(@Param('codigo') codigoMat: string) {
    return this.materiaService.borrarMateria(codigoMat);
  }
}
