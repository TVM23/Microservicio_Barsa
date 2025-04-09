import { IsIn, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "@app/contracts";
import { Transform, Type } from "class-transformer";

export class MateriaPaginationDto extends PaginationDto{

    @IsOptional()
    @IsString({ message: 'El código de material debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public codigoMat: string

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public descripcion: string

    @IsOptional()
    @IsString({ message: 'La unidad debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public unidad: string

    @IsOptional()
    @IsString({ message: 'El proceso debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public proceso: string

    @IsOptional()
    @IsString({ message: 'El estado debe ser un texto válido.' })
    @Transform(({ value }) => value.trim()) 
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' }) 
    public borrado: string
}