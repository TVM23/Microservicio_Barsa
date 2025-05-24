import { Transform, Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { TiempoDto } from "./tiempo.dto";

export class FinalizarTiempoDto extends TiempoDto {

    /*@IsNumber({}, { message: 'El tiempo debe ser un número válido.' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'El tiempo no puede estar vacío.' })
    fechaFin: number;*/

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    fechaFin: string;

    @IsInt({ message: 'El tiempo debe ser un entero válido.' })
    @IsNumber({}, { message: 'El tiempo debe ser un número válido.' })
    @Type(() => Number)
    tiempo: number;
}