import { Transform, Type } from "class-transformer";
import { ArrayNotEmpty, IsDateString, IsInt, IsNumber, Min, ValidateNested } from "class-validator";
import { DetalleMovProductoDTO } from "./detalle-movimiento.producto.dto";

export class MovimientosDto {
    @IsInt({ message: 'El ID de movimiento debe ser un entero válido' })
    @IsNumber({}, { message: 'El ID de movimiento debe ser un número válido' })
    @Type(() => Number)
    @Min(0, { message: 'El folio debe ser mayor o igual a 0' })
    movId: number;

    @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
    @Transform(({ value }) => value.trim())  
    fecha: string;

    @IsInt({ message: 'El número de ID debe ser un entero válido' })
    @IsNumber({}, { message: 'El folio debe ser un número válido' })
    @Type(() => Number)
    @Min(0, { message: 'El folio debe ser mayor o igual a 0' })
    folio: number = 0;

    @ValidateNested({ each: true })
    @Type(() => DetalleMovProductoDTO)
    @ArrayNotEmpty({ message: 'La lista de detalle no puede estar vacía' })
    public detalles: DetalleMovProductoDTO[];
}