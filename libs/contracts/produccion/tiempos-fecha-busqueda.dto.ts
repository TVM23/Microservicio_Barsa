import { PaginationDto } from "../common";
import { Transform, Type } from "class-transformer"
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class TiemposFechaBusquedaDto extends PaginationDto{
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    public fechaInicio: string;
      
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    public fechaFin: string;
}