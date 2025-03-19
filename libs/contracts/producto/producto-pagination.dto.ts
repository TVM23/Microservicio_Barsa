import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator"
import { PaginationDto } from "../common"
import { Type } from "class-transformer";

export class ProductoPaginationDto extends PaginationDto {

    @IsOptional()
    @IsString()
    codigo: string;

    @IsOptional()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsString()
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
    ean: string;

    @IsOptional()
    @IsString()
    sku: string;

    @IsOptional()
    @IsBoolean({ message: 'Valor incorrecto' })
    @Type(() => Boolean)
    tapices: boolean;

    @IsOptional()
    @IsBoolean({ message: 'Valor incorrecto' })
    @Type(() => Boolean)
    borrado: boolean;
}