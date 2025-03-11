import { IsBoolean, IsOptional, IsString } from "class-validator";
import { PaginationDto } from "../common";
import { boolean } from "joi";
import { Type } from "class-transformer";

export class MateriaPaginationDto extends PaginationDto{

    @IsOptional()
    @IsString()
    public codigoMat: string

    @IsOptional()
    @IsString()
    public descripcion: string

    @IsOptional()
    @IsString()
    public unidad: string

    @IsOptional()
    @IsString()
    public proceso: string

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    public borrado: boolean
}