import { Transform, Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator";

export class TiempoDto {
    @IsInt({ message: 'El numero del folio debe ser un entero válido.' })
    @IsNumber({}, { message: 'El folio debe ser un número válido.' })
    @Type(() => Number)
    @Min(1, { message: 'El folio debe ser mayor a 0.' })
    folio: number;
        
    @IsString({ message: 'La etapa debe ser un texto válido.' })
    @MaxLength(40, { message: 'La etapa no debe exceder los 40 caracteres.' })
    @Transform(({ value }) => value.trim())  
    @IsNotEmpty({ message: 'La etapa no puede estar vacía.' })
    etapa: string;
}