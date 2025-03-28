import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { PaginationDto } from "../common"
import { Transform, Type } from "class-transformer";

export class ProductoPaginationDto extends PaginationDto {

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    codigo: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    descripcion: string;

    @IsOptional()
    @IsString()
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
    @IsString()
    @Transform(({ value }) => value.trim())  
    ean: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    sku: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    tapices: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    borrado: string;
}