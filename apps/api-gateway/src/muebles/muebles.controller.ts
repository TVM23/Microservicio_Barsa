import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { MueblesService } from './muebles.service';
import { CreateMuebleDto, PaginationDto } from '@app/contracts';
import { UpdateMuebleDto } from './dto/update-mueble.dto';


@Controller('muebles')
export class MueblesController {
    constructor (private mueblesService: MueblesService) {}


    @Get()
    async findAll(){
        return await this.mueblesService.findAllMueble()
    }

    @Get('paginado')
    async findAllPage(@Query() paginationDto: PaginationDto){
        return await this.mueblesService.findAllPaginado(paginationDto)
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number){
        return await this.mueblesService.findMuebleById(id)
    }

    @Post()
    createMueble(@Body() createMuebleDto: CreateMuebleDto) {
        return this.mueblesService.createMueble(createMuebleDto);
    }

    @Patch(':id')
    async updateMueble(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateMuebleDto: UpdateMuebleDto
    ) {
        return await this.mueblesService.updateMueble({id, ...updateMuebleDto});
    }

    @Patch(`status/:id`)
    async changeEstadoMueble(@Param('id') id: number){
        return await this.mueblesService.changeStatus(id)
    }

    @Delete(':id')
    async deleteMueble(@Param('id') id: number) {
        return await this.mueblesService.deleteMueble(id);
    }
}
