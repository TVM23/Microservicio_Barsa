import { Controller, ParseIntPipe } from '@nestjs/common';
import { MueblesService } from './muebles.service';
import { CreateMuebleDto, UpdateMuebleDto, PaginationDto, MUEBLES_PATTERNS } from '@app/contracts';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller('muebles')
export class MueblesController {
  constructor(private readonly mueblesService: MueblesService) {}

  //@Get('todos')
  @MessagePattern(MUEBLES_PATTERNS.FIND_ALL)
  async getMuebles() {
    return await this.mueblesService.getMuebles();
  }

  //@Get('paginado')
  @MessagePattern(MUEBLES_PATTERNS.FIND_PAGINADO)
  async getMueblesPaginado(@Payload() paginationDto: PaginationDto ){
    return await this.mueblesService.getMueblesPaginado(paginationDto);
  }

  //@Get(':id')
  @MessagePattern(MUEBLES_PATTERNS.FIND_ONE)
  getMuebleById(@Payload('id', ParseIntPipe) id: number) {
    return this.mueblesService.getMuebleById(id);
  }

  //@Post()
  @MessagePattern(MUEBLES_PATTERNS.CREATE_MUEBLE)
  createMueble(@Payload() createMuebleDto: CreateMuebleDto) {
    return this.mueblesService.createMueble(createMuebleDto);
  }

  //@Patch(':id')
  @MessagePattern(MUEBLES_PATTERNS.UPDATE_MUEBLE)
  async updateMueble(
    //@Param('id', ParseIntPipe) id: number,
    //@Body() updateMuebleDto: UpdateMuebleDto,
    @Payload() updateMuebleDto: UpdateMuebleDto
  ) {
    return this.mueblesService.updateMueble(updateMuebleDto.id, updateMuebleDto);
  }

  //@Patch(`status/:id`)
  @MessagePattern(MUEBLES_PATTERNS.CHANGE_STATUS)
  async changeEstadoMueble(@Payload('id', ParseIntPipe) id: number){
    return this.mueblesService.changeEstadoMueble(id)
  }

  //@Delete(':id')
  @MessagePattern(MUEBLES_PATTERNS.DELETE_MUEBLE)
  async deleteMueble(@Payload('id', ParseIntPipe) id: number) {
    return await this.mueblesService.deleteMueble(id);
  }
}
