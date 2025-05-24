import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class DetalleMovProductoDTO {

    @IsString({ message: 'El codigo debe ser un texto válido' })
    @Transform(({ value }) => value.toUpperCase().trim()) 
    codigo: string;

    @IsInt({ message: 'El ID del color debe ser un entero válido' })
    @IsNumber({}, { message: 'El ID del color debe ser un número válido' })
    @Type(() => Number)
    @Min(1, { message: 'El colorId debe ser mayor a 1' })
    colorId: number;

    @IsInt({ message: 'La cantidad debe ser un entero válido' })
    @IsNumber({}, { message: 'La cantidad debe ser un número válido.' })
    @Type(() => Number)
    @Min(1, { message: 'La cantidad debe ser mayor a 1' })
    cantidad: number;
    
    @IsInt({ message: 'El numero del almacen debe ser un entero válido' })
    @IsNumber({}, { message: 'El numero del almacen debe ser un número válido.' })
    @Type(() => Number)
    @Min(0, { message: 'La cantidad debe ser mayor a 0' })
    noAlmacen: number = 0;
}