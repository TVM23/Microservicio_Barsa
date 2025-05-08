import { PaginationDto } from "@app/contracts"
import { Transform, Type } from "class-transformer"
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class InventarioSalidasPaginationDto extends PaginationDto {

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
    @IsInt({ message: 'El número de ID debe ser un entero válido' })
    @IsNumber({}, { message: 'El folio debe ser un número válido' })
    @Type(() => Number)
    @Min(1, { message: 'El folio debe ser mayor a 0' })
    public folio: number;

    @IsOptional()
    @IsString({ message: 'La razón debe ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public razon: string;

    @IsOptional()
    @IsString({ message: 'El destino debe ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public destino: string;

    @IsOptional()
    @IsString({ message: 'Las notas extras deben ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public notes: string;

    @IsOptional()
    @IsString({ message: 'El nombre de usuario debe ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public usuario: string;

    @IsOptional()
    @IsString({ message: 'El código de material debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public codigoMat: string

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public descripcion: string
    
}