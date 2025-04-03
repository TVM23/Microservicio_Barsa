import { PaginationDto } from "@app/contracts";
import { Transform, Type } from "class-transformer";
import { IsDateString, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class PapeletaPaginationDto extends PaginationDto{
    @IsOptional()
    @IsString({ message: 'El tipo de papeleta debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    tipoId: string

    @IsOptional()
    @IsInt({ message: 'El número de ID debe ser un entero válido.' })
    @IsNumber({}, { message: 'El folio debe ser un número válido.' })
    @Type(() => Number)
    @Min(1, { message: 'El folio debe ser mayor a 0.' })
    folio: number

    @IsOptional()
    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD).' })
    @Transform(({ value }) => value.trim())  
    fecha: string;

    @IsOptional()
    @IsString({ message: 'El estado debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    status: string

    @IsOptional()
    @IsString({ message: 'La observación debe ser un texto válido.' })
    @MaxLength(100, { message: 'La observación no debe exceder los 100 caracteres.' })
    @Transform(({ value }) => value.trim())  
    observacionGeneral: string;
}