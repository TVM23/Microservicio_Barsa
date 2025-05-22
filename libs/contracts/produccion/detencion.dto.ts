import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { TiempoDto } from "./tiempo.dto";
import { Transform, Type } from "class-transformer";

export class DetencionDto extends TiempoDto {

    @IsNumber({}, { message: 'El tiempo debe ser un número válido.' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'El tiempo no puede estar vacío.' })
    fecha: number;

    @IsString({ message: 'El motivo debe ser un texto válido.' })
    @MaxLength(100, { message: 'El motivo no debe exceder los 100 caracteres.' })
    @Transform(({ value }) => value.trim())  
    motivo: string;

    @IsInt({ message: 'El tiempo debe ser un entero válido.' })
    @IsNumber({}, { message: 'El tiempo debe ser un número válido.' })
    @Type(() => Number)
    tiempo: number;
}