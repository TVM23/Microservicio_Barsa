import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ProduccionService } from './produccion.service';
import { DesactivarDetencionDto, DetencionDto, FinalizarTiempoDto, IniciarTiempoDto, PausarTiempoDto, ReiniciarTiempoDto, Role, Roles } from '@app/contracts';
import { TiempoDto } from 'libs/contracts/produccion/tiempo.dto';
import { GetCurrentUserName } from '../user-authentication/common/decorators/get-current-user-name.decorator';

@Controller('produccion')
export class ProduccionController {
    constructor(private readonly produccionService: ProduccionService) {}

    @Post('iniciar-tiempo')
    @Roles(Role.PRODUCCION) 
    async iniciarTiempo(
        @Body() iniciarTiempoDto: IniciarTiempoDto,
        @GetCurrentUserName() nombreUsuario: string
    ) {
        return await this.produccionService.iniciarTiempo( { ...iniciarTiempoDto, nombreUsuario } );
    }

    @Put('pausar-tiempo')
    @Roles(Role.PRODUCCION) 
    async pausarTiempo(
        @Body() pausarTiempoDto: PausarTiempoDto,
        @GetCurrentUserName() nombreUsuario: string
    ) {
        return await this.produccionService.pausarTiempo( { ...pausarTiempoDto, nombreUsuario } );
    }

    @Put('reiniciar-tiempo')
    @Roles(Role.PRODUCCION) 
    async reiniciarTiempo(
        @Body() reiniciarTiempoDto: ReiniciarTiempoDto,
        @GetCurrentUserName() nombreUsuario: string
    ) {
        return await this.produccionService.reiniciarTiempo( { ...reiniciarTiempoDto, nombreUsuario } );
    }

    @Put('finalizar-tiempo')
    @Roles(Role.PRODUCCION) 
    async finalizarTiempo(
        @Body() finalizarTiempoDto: FinalizarTiempoDto,
        @GetCurrentUserName() nombreUsuario: string
    ){
        return await this.produccionService.finalizarTiempo( { ...finalizarTiempoDto, nombreUsuario } );
    }

    @Post('detencion-tiempo')
    @Roles(Role.PRODUCCION) 
    async detenerTiempo(
        @Body() detenerTiempoDto: DetencionDto,
        @GetCurrentUserName() nombreUsuario: string
    ){
        return await this.produccionService.detenerTiempo( { ...detenerTiempoDto, nombreUsuario } );
    }

    @Put('desactivar-detencion-tiempo')
    @Roles(Role.PRODUCCION) 
    async desactivarDetencion(
        @Body() desactivarDetencionDto: DesactivarDetencionDto,
        @GetCurrentUserName() nombreUsuario: string
    ){
        return await this.produccionService.desactivarDetencion( { ...desactivarDetencionDto, nombreUsuario } );
    }

    @Get('obtener-tiempo')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.PRODUCCION) 
    async obtenerTiempo(
        @Query() tiempoDto: TiempoDto,
        @GetCurrentUserName() nombreUsuario: string
    ){
        return await this.produccionService.obtenerTiempo( { ...tiempoDto, nombreUsuario } );
    }

    @Get('obtener-detencion')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.PRODUCCION) 
    async obtenerDetencion(@Query() tiempoDto: TiempoDto){
        return await this.produccionService.obtenerDetencion(tiempoDto);
    }

    @Get('obtener-tiempos/:procesoFolio')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.PRODUCCION) 
    async obtenerTiemposFolio(@Param('procesoFolio') procesoFolio: number){
        return await this.produccionService.obtenerTiemposFolio(procesoFolio);
    }

    @Get('obtener-ultima-detencion/:procesoFolio')
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.PRODUCCION) 
    async obtenerUltimaDetencionActiva(@Param('procesoFolio') procesoFolio: number){
        return await this.produccionService.obtenerUltimaDetencionActiva(procesoFolio);
    }

}
