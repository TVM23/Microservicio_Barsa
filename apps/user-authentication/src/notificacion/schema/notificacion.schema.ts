import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type NotificacionDocument = Notificacion & Document;

@Schema()
export class Notificacion {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  codigo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop({ required: true })
  mensaje: string;

  @Prop({ required: true })
  color: 'ROJO' | 'NARANJA' | 'AMARILLO'; // solo estos valores

  @Prop({ required: true })
  existencia: number;

  @Prop({ required: true })
  minimo: number;

  @Prop({ required: true })
  fecha: string; // o usa Date si lo prefieres

  @Prop({ required: true })
  area: string;
}

export const NotificacionSchema = SchemaFactory.createForClass(Notificacion);
