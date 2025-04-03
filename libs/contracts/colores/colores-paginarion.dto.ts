import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PaginationDto } from "../common";
import { Transform, Type } from "class-transformer";

export class ColoresPaginationDto extends PaginationDto{

    @IsOptional()
    @IsInt({ message: 'El número de ID debe ser un entero válido.' })
    @IsNumber({}, { message: 'Debe ingresar un valor de ID valido' })
    @Min(0, { message: 'No puedes poner un valor negativo' })
    @Type(() => Number)
    colorId: number;
    
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public descripcion: string

    @IsOptional()
    @IsString({ message: 'El estado debe ser un valor válido.' })
    @Transform(({ value }) => value.trim())  
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' })
    public borrado: string
}