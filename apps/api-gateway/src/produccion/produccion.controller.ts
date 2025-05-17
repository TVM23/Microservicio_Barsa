import { Body, Controller, Post, Put } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { FinalizarTiempoDto, IniciarTiempoDto, PausarTiempoDto, ReiniciarTiempoDto } from '@app/contracts';

@Controller('produccion')
export class ProduccionController {
    constructor(private readonly produccionService: ProduccionService) {}

    @Post('iniciar-tiempo')
    async iniciarTiempo(@Body() iniciarTiempoDto: IniciarTiempoDto) {
        return await this.produccionService.iniciarTiempo(iniciarTiempoDto);
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

}
