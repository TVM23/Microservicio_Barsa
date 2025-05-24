import { PaginationDto } from "../common";
import { Transform, Type } from "class-transformer"
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator"

export class MovimientoProductoPagiDto extends PaginationDto{
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
    public consecutivo: number;
    
    @IsOptional()
    @IsInt({ message: 'El ID del movimiento debe ser un entero válido' })
    @IsNumber({}, { message: 'El ID del movimiento debe ser un número válido' })
    @Type(() => Number)
    @Min(1, { message: 'El ID del movimiento debe ser mayor a 0' })
    public movId: number;
    
    @IsOptional()
    @IsInt({ message: 'El número de folio debe ser un entero válido' })
    @IsNumber({}, { message: 'El folio debe ser un número válido' })
    @Type(() => Number)
    @Min(0, { message: 'El folio debe ser mayor o igual a a 0' })
    public folio: number;
    
    @IsOptional()
    @IsString({ message: 'El nombre del usuario ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public usuario: string;
    
    @IsOptional()
    @IsString({ message: 'El código del producto debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public codigo: string
    
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto válido.' })
    @Transform(({ value }) => value.trim())  
    public descripcion: string
}