import { Transform, Type } from "class-transformer";
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class DetalleMovMateriaDTO {

    @IsString({ message: 'El codigo debe ser un texto válido' })
    @Transform(({ value }) => value.toUpperCase().trim()) 
    codigoMat: string;

    @IsNumber({}, { message: 'La cantidad debe ser un número válido.' })
    @Type(() => Number)
    @Min(0.001, { message: 'La cantidad debe ser mayor a 0' })
    cantidad: number;
    
    @IsOptional()
    @IsBoolean({ message: 'El campo de Procesada debe ser un valor booleano (true o false).' })
    @Transform(({ value }) => {
        if (typeof value === 'string') {
        return value.toLowerCase().trim() === 'true';
        }
        return Boolean(value);
    })
    procesada: boolean = false;
}