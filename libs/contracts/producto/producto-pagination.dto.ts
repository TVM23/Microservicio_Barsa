import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { PaginationDto } from "../common"
import { Transform, Type } from "class-transformer";

export class ProductoPaginationDto extends PaginationDto {

    @IsOptional()
    @IsString({ message: 'El código debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    codigo: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    descripcion: string;

    @IsOptional()
    @IsString({ message: 'La unidad debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    unidad: string;

    @IsOptional()
    @IsNumber({}, { message: 'Debe ingresar un valor de costo valido' })
    @Min(0, { message: 'No puedes poner un valor negativo' })
    @Type(() => Number)
    costo: number;

    @IsOptional()
    @IsNumber({}, { message: 'Debe ingresar un valor de venta valido' })
    @Min(0, { message: 'No puedes poner un valor negativo' })
    @Type(() => Number)
    venta: number;

    @IsOptional()
    @IsString({ message: 'El código EAN debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    ean: string;

    @IsOptional()
    @IsString({ message: 'El SKU debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    sku: string;

    @IsOptional()
    @IsString({ message: 'El campo tapices debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    tapices: string;

    @IsOptional()
    @IsString({ message: 'El estado debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' })
    borrado: string;
}