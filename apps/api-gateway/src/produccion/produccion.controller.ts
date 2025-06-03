import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { DesactivarDetencionDto, DetencionDto, FinalizarTiempoDto, IniciarTiempoDto, PausarTiempoDto, ReiniciarTiempoDto } from '@app/contracts';
import { TiempoDto } from 'libs/contracts/produccion/tiempo.dto';
import { GetCurrentUserName } from '../user-authentication/common/decorators/get-current-user-name.decorator';

@Controller('produccion')
export class ProduccionController {
    constructor(private readonly produccionService: ProduccionService) {}

    @Post('iniciar-tiempo')
    async iniciarTiempo(
        @Body() iniciarTiempoDto: IniciarTiempoDto,
        @GetCurrentUserName() nombreUsuario: string
    ) {
        return await this.produccionService.iniciarTiempo( { ...iniciarTiempoDto, nombreUsuario } );
    }

    @Put('pausar-tiempo')
    async pausarTiempo(@Body() pausarTiempoDto: PausarTiempoDto) {
        return await this.produccionService.pausarTiempo(pausarTiempoDto);
    }

    @Put('reiniciar-tiempo')
    async reiniciarTiempo(@Body() reiniciarTiempoDto: ReiniciarTiempoDto) {
        return await this.produccionService.reiniciarTiempo(reiniciarTiempoDto);
    }

    @Put('finalizar-tiempo')
    async finalizarTiempo(@Body() finalizarTiempoDto: FinalizarTiempoDto){
        return await this.produccionService.finalizarTiempo(finalizarTiempoDto);
    }

    @Post('detencion-tiempo')
    async detenerTiempo(@Body() detenerTiempoDto: DetencionDto){
        return await this.produccionService.detenerTiempo(detenerTiempoDto);
    }

    @Put('desactivar-detencion-tiempo')
    async desactivarDetencion(@Body() desactivarDetencionDto: DesactivarDetencionDto){
        return await this.produccionService.desactivarDetencion(desactivarDetencionDto);
    }

    @Get('obtener-tiempo')
    async obtenerTiempo(@Query() tiempoDto: TiempoDto){
        return await this.produccionService.obtenerTiempo(tiempoDto);
    }

    @Get('obtener-detencion')
    async obtenerDetencion(@Query() tiempoDto: TiempoDto){
        return await this.produccionService.obtenerDetencion(tiempoDto);
    }

    @Get('obtener-tiempos/:procesoFolio')
    async obtenerTiemposFolio(@Param('procesoFolio') procesoFolio: number){
        return await this.produccionService.obtenerTiemposFolio(procesoFolio);
    }

    @Get('obtener-ultima-detencion/:procesoFolio')
    async obtenerUltimaDetencionActiva(@Param('procesoFolio') procesoFolio: number){
        return await this.produccionService.obtenerUltimaDetencionActiva(procesoFolio);
    }

}
