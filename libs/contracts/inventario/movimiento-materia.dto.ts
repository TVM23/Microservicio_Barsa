import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Matches, Min, ValidateNested } from "class-validator";
import { DetalleMovMateriaDTO } from "./detalle-movimiento.materia.dto";

export class MovimientoMateriaDto {

    @IsInt({ message: 'El ID de movimiento debe ser un entero válido' })
    @IsNumber({}, { message: 'El ID de movimiento debe ser un número válido' })
    @Type(() => Number)
    @Min(0, { message: 'El folio debe ser mayor o igual a 0' })
    movId: number;

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    fecha: string;

    @IsOptional()
    @IsInt({ message: 'El número de ID debe ser un entero válido' })
    @IsNumber({}, { message: 'El folio debe ser un número válido' })
    @Type(() => Number)
    @Min(0, { message: 'El folio debe ser mayor o igual a 0' })
    folio: number = 0;

    @IsOptional()
    @IsBoolean({ message: 'El campo de Procesada debe ser un valor booleano (true o false).' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
        return value.toLowerCase().trim() === 'true';
        }
        return Boolean(value);
    })
    procesada: boolean = false;

    @IsOptional()
    @IsString({ message: 'La razon debe ser un texto válido' })
    @Transform(({ value }) => value.toUpperCase().trim()) 
    observacion: string;

    @IsOptional()
    @IsString({ message: 'La razon debe ser un texto válido' })
    @Transform(({ value }) => value.toUpperCase().trim()) 
    autoriza: string;

    @ValidateNested({ each: true })
    @Type(() => DetalleMovMateriaDTO)
    @ArrayNotEmpty({ message: 'La lista de detalle no puede estar vacía' })
    public detalles: DetalleMovMateriaDTO[];
}