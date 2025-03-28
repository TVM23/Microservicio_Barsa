import { IsNumber, IsOptional, IsString, Min } from "class-validator";
import { PaginationDto } from "../common";
import { Transform, Type } from "class-transformer";

export class ColoresPaginationDto extends PaginationDto{

    @IsOptional()
    @IsNumber({}, { message: 'Debe ingresar un valor de venta valido' })
    @Min(0, { message: 'No puedes poner un valor negativo' })
    @Type(() => Number)
    colorId: number;
    
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public descripcion: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public borrado: string
}