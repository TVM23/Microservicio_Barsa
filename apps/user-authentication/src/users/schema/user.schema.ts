import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { required } from "joi";
import { SchemaTypes, Types } from "mongoose";

@Schema()
export class User {
    @Prop({ type: SchemaTypes.ObjectId, auto: true })
    _id: Types.ObjectId;

    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    rol: string;
}

export const UserSchema = SchemaFactory.createForClass(User);