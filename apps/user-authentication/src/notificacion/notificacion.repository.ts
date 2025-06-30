import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NotificacionDocument } from "./schema/notificacion.schema";

@Injectable()
export class NotificacionRepository {
    constructor (@InjectModel('Notificacion') private notificacionModel: Model<NotificacionDocument>) {}

  async eliminarNotificacionesInventarioExcluyendoCodigos(codigos: string[]) {
    return this.notificacionModel.deleteMany({
      area: 'INVENTARIO',
      codigo: { $nin: codigos },
    });
  }

  async upsertNotificacionInventario(materia: any) {
    return this.notificacionModel.updateOne(
      { codigo: materia.codigo, area: 'INVENTARIO' },
      { $set: materia },
      { upsert: true },
    );
  }

  async upsertNotificacionTiempo(tiempo: any) {
    return this.notificacionModel.updateOne(
      { codigo: tiempo.codigo },
      { $set: tiempo },
      { upsert: true },
    );
  }

  async obtenerTodas() {
    return this.notificacionModel.find().lean();
  }

  async obtenerPorArea(area: string) {
    return this.notificacionModel.find({ area }).lean();
  }

  async eliminarPorCodigoYEtapas(codigo: string, etapas: string[]) {
    return this.notificacionModel.deleteMany({
      codigo,
      etapa: { $in: etapas },
    });
  }

  async upsertPorCodigoYEtapa(codigo: string, etapa: string, data: any) {
    return this.notificacionModel.updateOne(
      { codigo, etapa },
      {
        $set: {
          mensaje: data.mensaje,
          descripcion: data.descripcion,
          fecha: data.fecha || new Date(),
          area: data.area,
        },
      },
      { upsert: true },
    );
  }

  async eliminarNotificacionesFinalizacionTiempoAntiguas() {
      const tresDiasAntes = new Date();
      tresDiasAntes.setDate(tresDiasAntes.getDate() - 3);

      await this.notificacionModel.deleteMany({
        descripcion: "FINALIZACIÓN DE TIEMPO",
        fecha: { $lte: tresDiasAntes.toISOString().split("T")[0] }  // Formato YYYY-MM-DD
      });
    }
}