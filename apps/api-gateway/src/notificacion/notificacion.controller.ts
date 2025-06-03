import { Controller, Get } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';

@Controller('notificacion')
export class NotificacionController {
    constructor(private readonly notificacionService: NotificacionService) {}

    @Get('lista-notificaciones')
    async getListadoNotificaciones(){
        return await this.notificacionService.getListadoNotificaciones();
    }
}
