import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka, RpcException } from '@nestjs/microservices';
import { Notificacion } from './dto/notificacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificacionDocument } from './schema/notificacion.schema';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificacionService {
    constructor (
      @InjectModel('Notificacion') private notificacionModel: Model<NotificacionDocument>,
      private readonly http: HttpService,    
    ) {}

    async procesarYListarNotificaciones(rol: string) {
        const { data: materias } = await this.http.axiosRef.get(
        'http://access-api:8080/notificacion/lista-notificaciones',
        );

        // 1. Eliminar las notificaciones de materias que ya no están bajas
        const materiasInventario = materias.filter(m => m.area === 'INVENTARIO');
        const codigosInventario = materiasInventario.map(m => m.codigo);

        await this.notificacionModel.deleteMany({ 
          area: "INVENTARIO",
          codigo: { $nin: codigosInventario } 
        });

        // 2. Insertar o actualizar materias bajas
        for (const materia of materias) {
          await this.notificacionModel.updateOne(
              { codigo: materia.codigo, area: "INVENTARIO" },
              { $set: materia },
              { upsert: true },
          );
        }

        // 3. Devolver lista actual de MongoDB
        switch(rol){
          case "Administrador":
            return this.notificacionModel.find().lean();
          case "Inventarios":
            return this.notificacionModel.find({area: "INVENTARIO"}).lean();
          case "Produccion":
            return this.notificacionModel.find({area: "PRODUCCION"}).lean();
          default:
            return [];
        }        
    }

    async crearNotificacion(data: any) {
      return this.notificacionModel.updateOne(
        { codigo: data.codigo }, // condición de búsqueda
        {
          $set: {
            mensaje: data.mensaje,
            fecha: new Date(),
            descripcion: data.descripcion,
            area: data.area
          }
        },
        { upsert: true } // crea si no existe
      );
    }
}

