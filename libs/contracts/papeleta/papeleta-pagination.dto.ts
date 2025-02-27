import { PaginationDto } from "@app/contracts";
import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class PapeletaPaginationDto extends PaginationDto{
    @IsOptional()
    @IsString()
    tipoId: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    folio: number

    @IsOptional()
    @IsDateString()
    fecha: string;

    @IsOptional()
    @IsString()
    status: string

    @IsOptional()
    @IsString()
    observacionGeneral: string;
}