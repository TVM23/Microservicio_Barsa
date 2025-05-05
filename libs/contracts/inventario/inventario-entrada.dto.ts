import { ArrayNotEmpty, IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { InventarioItemDTO } from "@app/contracts";

export class InventarioEntradaDTO {

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    public fecha: string;

    @IsInt({ message: 'El ID de proveedor debe ser un entero válido' })
    @IsNumber({}, { message: 'El ID de proveedor debe ser un número válido' })
    @Type(() => Number)
    @Min(1, { message: 'El ID de proveedor debe ser mayor a 0' })
    public proveedorId: number;

    @ValidateNested({ each: true })
    @Type(() => InventarioItemDTO)
    @ArrayNotEmpty({ message: 'La lista de items no puede estar vacía' })
    public items: InventarioItemDTO[];

    @IsNumber({}, { message: 'El monto total debe ser un número válido' })
    @Type(() => Number)
    @Min(0.01, { message: 'El monto total debe ser mayor a 0.01' })
    public totalAmount: number;

    @IsOptional()
    @IsString({ message: 'Las notas extras deben ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public notes: string;
}