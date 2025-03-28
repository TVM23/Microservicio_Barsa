import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../common";
import { boolean } from "joi";
import { Transform, Type } from "class-transformer";

export class MateriaPaginationDto extends PaginationDto{

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public codigoMat: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public descripcion: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public unidad: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public proceso: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public borrado: string
}