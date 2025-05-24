import { Transform, Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { TiempoDto } from "./tiempo.dto";

export class IniciarTiempoDto extends TiempoDto {

    /*@IsNumber({}, { message: 'El tiempo debe ser un número válido.' })
    @Type(() => Number)
    @IsNotEmpty({ message: 'El tiempo no puede estar vacío.' })
    fechaInicio: number;*/

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    fechaInicio: string;
}