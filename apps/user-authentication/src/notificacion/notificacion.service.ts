import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificacionDocument } from './schema/notificacion.schema';
import { HttpService } from '@nestjs/axios';
import { NotificacionRepository } from './notificacion.repository';

@Injectable()
export class NotificacionService {
    constructor (
      private readonly notificacionRepository: NotificacionRepository,
      private readonly http: HttpService,    
    ) {}

    async procesarYListarNotificaciones(rol: string) {
        const { data: materias } = await this.http.axiosRef.get(
        'http://access-api:8080/notificacion/lista-notificaciones',
        );


        // 1. Eliminar las notificaciones de materias que ya no están bajas
        const materiasInventario = materias.filter(m => m.area === 'INVENTARIO');
        const codigosInventario = materiasInventario.map(m => m.codigo);

        await this.notificacionRepository.eliminarNotificacionesInventarioExcluyendoCodigos(codigosInventario);

        // 2. Insertar o actualizar materias bajas
        for (const materia of materias) {
          await this.notificacionRepository.upsertNotificacionInventario(materia);
        }

        // 3. Insertar tiempos paussados por mucho tiempo
        const { data: tiempos } = await this.http.axiosRef.get(
        'http://access-api:8080/notificacion/lista-notificaciones-tiempos',
        );
        for (const tiempo of tiempos) {
          //await this.notificacionRepository.upsertNotificacionTiempo(tiempo);
          await this.crearNotificacion(tiempo);
        }

        //4. Elmiminar notifs antiguas
        await this.notificacionRepository.eliminarNotificacionesFinalizacionTiempoAntiguas();

        // 3. Devolver lista actual de MongoDB
        switch(rol){
          case "Administrador":
          case "SuperAdministrador":
            return this.notificacionRepository.obtenerTodas();
          case "Inventarios":
            return this.notificacionRepository.obtenerPorArea('INVENTARIO');
          case "Produccion":
            return this.notificacionRepository.obtenerPorArea('PRODUCCION');
          default:
            return [];
        }        
    }

    async crearNotificacion(data: any) {
      // 1. Elimina notificaciones anteriores si es una etapa superior
      const etapasIniciales = ['MADERA', 'PRODUCCION'];
      const etapaActual = data.etapa?.toUpperCase();

      // Si etapa no es MADERA ni PRODUCCION, entonces borra esas
      if (!etapasIniciales.includes(etapaActual)) {
        await this.notificacionRepository.eliminarPorCodigoYEtapas(data.codigo, etapasIniciales);
      }

      // 2. Crea o actualiza la notificación para esa etapa
      return this.notificacionRepository.upsertPorCodigoYEtapa(data.codigo, etapaActual, data);
    }


}

