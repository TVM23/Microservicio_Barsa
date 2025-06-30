import { Transform, Type } from "class-transformer";
import { IsDateString, IsInt, IsNotEmpty, IsNumber } from "class-validator";
import { TiempoDto } from "./tiempo.dto";

export class PausarTiempoDto extends TiempoDto {
    @IsInt({ message: 'El tiempo debe ser un entero válido.' })
    @IsNumber({}, { message: 'El tiempo debe ser un número válido.' })
    @Type(() => Number)
    tiempo: number;

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    fechaPausa: string;
}