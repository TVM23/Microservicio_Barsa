import { Body, Controller, Post } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { IniciarTiempoDto } from '@app/contracts';

@Controller('produccion')
export class ProduccionController {
    constructor(private readonly produccionService: ProduccionService) {}

    @Post('iniciar-tiempo')
    async iniciarTiempo(@Body() iniciarTiempoDto: IniciarTiempoDto) {
        await this.produccionService.iniciarTiempo(iniciarTiempoDto);
    }
}
