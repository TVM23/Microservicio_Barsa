import { Transform, Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class IniciarTiempoDto {

    @IsInt({ message: 'El número de ID debe ser un entero válido.' })
    @IsNumber({}, { message: 'El folio debe ser un número válido.' })
    @Type(() => Number)
    @Min(1, { message: 'El folio debe ser mayor a 0.' })
    private folio: number;

    @IsString({ message: 'La etapa debe ser un texto válido.' })
    @MaxLength(40, { message: 'La etapa no debe exceder los 40 caracteres.' })
    @Transform(({ value }) => value.trim())  
    private etapa: string;

    @IsOptional()
    @IsNumber({}, { message: 'El folio debe ser un número válido.' })
    @Type(() => Number)
    private fechaInicio: number;
}