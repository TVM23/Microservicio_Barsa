import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: false, default: "" }) 
    apellidoPaterno: string;

    @Prop({ required: false, default: "" }) 
    apellidoMaterno: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, select: false })
    password: string;

    @Prop({ required: true })
    rol: string;

    @Prop({ default: true })
    estado: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
