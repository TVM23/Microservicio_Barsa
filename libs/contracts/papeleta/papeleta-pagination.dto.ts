import { PaginationDto } from "@app/contracts";
import { Transform, Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class PapeletaPaginationDto extends PaginationDto{
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    tipoId: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    folio: number

    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => value.trim())  
    fecha: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    status: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    observacionGeneral: string;
}