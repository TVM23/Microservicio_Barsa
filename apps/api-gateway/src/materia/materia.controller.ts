import * as path from 'path';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, BadRequestException, Put } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { MateriaPaginationDto, CreateMateriaDto, Roles, Role } from '@app/contracts';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'libs/cloudinary/cloudinary.service';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { GetCurrentUserName } from '../user-authentication/common/decorators/get-current-user-name.decorator';

@Controller('materia')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService, private readonly cloudinaryService: CloudinaryService) {}

  @Get('get-listado')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INVENTARIOS) 
  async getListadoMateria(){
    return await this.materiaService.getListadoMateria();
  }

  @Get('get-listado-materia')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INVENTARIOS) 
  async getListadoMateriaFiltro(@Query() dtoMateriaPaginado: MateriaPaginationDto){
    return await this.materiaService.getListadoMateriaFiltro(dtoMateriaPaginado);
  }

  @Get(':codigo')
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.INVENTARIOS) 
  async getMateriaPorCodigo(@Param('codigo') codigo: string){
    return await this.materiaService.getMateriaPorCodigo(codigo);
  }

  @Post('crear-materia')
  @Roles(Role.INVENTARIOS) 
  @UseInterceptors(AnyFilesInterceptor())
  async createMateria(
    @Body() createMateriaDto: CreateMateriaDto,
    @GetCurrentUserName() usuario: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) 
  {
    const uploaded  = await this.procesarImagenes(files);
    createMateriaDto.imagenes = uploaded;
    return this.materiaService.createMateria(createMateriaDto, usuario);
  }
  
  @Put('update-materia/:codigo')
  @Roles(Role.INVENTARIOS) 
  @UseInterceptors(AnyFilesInterceptor())
  async updateMateria(
    @Param('codigo') codigoMat: string,
    @Body() updateMateriaDto: UpdateMateriaDto,
    @GetCurrentUserName() usuario: string,
    @UploadedFiles() files: Express.Multer.File[],
  ){
    const uploaded  = await this.procesarImagenes(files);
    updateMateriaDto.imagenes = uploaded;
    return this.materiaService.updateMateria({codigoMat, ...updateMateriaDto}, usuario)
  }

  @Delete('borrar-materia/:codigo')
  @Roles(Role.INVENTARIOS) 
  borrarMateria(
    @Param('codigo') codigoMat: string,
    @GetCurrentUserName() usuario: string,
  ) {
    return this.materiaService.borrarMateria(codigoMat, usuario);
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
