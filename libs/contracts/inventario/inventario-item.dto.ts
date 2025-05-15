import { Transform, Type } from "class-transformer";
import { IsNumber, IsString, Min } from "class-validator";

export class InventarioItemDTO {

    @IsString({ message: 'El codigo debe ser un texto válido' })
    @Transform(({ value }) => value.toUpperCase().trim())  
    public codigo: string;

    @IsNumber({}, { message: 'La cantidad debe ser un número válido.' })
    @Type(() => Number)
    @Min(0.001, { message: 'La cantidad debe ser mayor a 0' })
    public cantidad: number;
    
}