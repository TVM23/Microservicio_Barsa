import { USER_PATTERNS } from '@app/contracts';
import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificacionService } from './notificacion.service';
import { Notificacion } from './dto/notificacion.dto';

@Controller('notificacion')
export class NotificacionController {
    constructor (private notificacionService: NotificacionService) {}

    @MessagePattern('obtener-notificaciones')
    async manejarNotificaciones(@Payload() data: { rol: string }) {
        return this.notificacionService.procesarYListarNotificaciones(data.rol);
    }

    @Post('crear')
    async crearNotificacion(@Body() body: any) {
        return await this.notificacionService.crearNotificacion(body);
    }
}
