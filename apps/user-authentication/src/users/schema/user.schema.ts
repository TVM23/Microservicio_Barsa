import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Role } from "@app/contracts";
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
    apellidos: string;

    @Prop({ required: true, unique: true })
    nombreUsuario: string;

    @Prop({ required: false })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, type: String, enum: Role })
    rol: Role;

    @Prop({ default: true })
    estado: boolean;

    @Prop({ required: false })
    hashRefreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
