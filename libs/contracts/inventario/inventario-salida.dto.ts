import { ArrayNotEmpty, IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";
import { InventarioItemDTO } from "@app/contracts";

export class InventarioSalidaDTO {

    @IsInt({ message: 'El número de ID debe ser un entero válido' })
    @IsNumber({}, { message: 'El folio debe ser un número válido' })
    @Type(() => Number)
    @Min(1, { message: 'El folio debe ser mayor a 0' })
    public folio: number;

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    public fecha: string;

    @IsOptional()
    @IsString({ message: 'La razon debe ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public reason: string;

    @ValidateNested({ each: true })
    @Type(() => InventarioItemDTO)
    @ArrayNotEmpty({ message: 'La lista de items no puede estar vacía' })
    public items: InventarioItemDTO[];

    @IsString({ message: 'El lugar de destino debe ser válido' })
    @Transform(({ value }) => value.toUpperCase().trim())  
    public destination: string;

    @IsOptional()
    @IsString({ message: 'Las notas extras deben ser un texto válido' })
    @Transform(({ value }) => value.trim()) 
    public notes: string;
}