import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PaginationDto } from "@app/contracts";
import { Transform, Type } from "class-transformer";

export class ProdxColorPafinationDto extends PaginationDto {

    @IsOptional()
    @IsString({ message: 'El código debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public codigo: string;

    @IsOptional()
    @IsInt({ message: 'El número de ID debe ser un entero válido.' })
    @IsNumber({}, { message: 'Debe ingresar un valor de venta valido' })
    @Min(0, { message: 'No puedes poner un valor negativo' })
    @Type(() => Number)
    colorId: number;

    @IsOptional()
    @IsString({ message: 'La descripción del producto debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public desProducto: string;

    @IsOptional()
    @IsString({ message: 'La descripción del color debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public desColor: string;
}