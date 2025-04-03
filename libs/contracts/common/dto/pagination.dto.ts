import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{

    @IsOptional()
    @IsPositive({ message: 'El número de página debe ser mayor que 0.' })
    @IsInt({ message: 'El número de página debe ser un entero válido.' })
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt({ message: 'El límite de resultados debe ser un entero válido.' })
    @IsPositive({ message: 'El límite de resultados debe ser mayor que 0.' })
    @Min(1, { message: 'El límite de resultados no puede ser menor a 1.' })
    @Type(() => Number)
    limit?: number = 10;
}