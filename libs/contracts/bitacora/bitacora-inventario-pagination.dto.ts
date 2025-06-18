import { PaginationDto } from "@app/contracts"
import { Transform, Type } from "class-transformer"
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class BitacoraInvPaginationDto extends PaginationDto {

    @IsOptional()
    @IsDateString({}, { message: 'La fecha de inicio debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    public fechaInicio: string;
  
    @IsOptional()
    @IsDateString({}, { message: 'La fecha de fin debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    public fechaFin: string;

    @IsOptional()
    @IsInt({ message: 'El ID debe ser un entero válido' })
    @IsNumber({}, { message: 'El ID debe ser un número válido' })
    @Type(() => Number)
    @Min(1, { message: 'El ID debe ser mayor a 0' })
    public id: number;

    @IsOptional()
    @IsString({ message: 'El codigo deben ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public codigo: string;

    @IsOptional()
    @IsString({ message: 'El movimiento ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public movimiento: string;

    @IsOptional()
    @IsString({ message: 'La descripcion del producto debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public descripcionProd: string

    @IsOptional()
    @IsString({ message: 'La descripción del material debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public descripcionMat: string

    @IsOptional()
    @IsString({ message: 'El estado debe ser un texto válido.' })
    @Transform(({ value }) => value.trim()) 
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' }) 
    public aumenta: string
}