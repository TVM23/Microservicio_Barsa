import { MovimientosDto } from "@app/contracts";
import { Transform } from "class-transformer";
import { IsString } from "class-validator";

export class MovimientoCompDto extends MovimientosDto {
    @IsString({ message: 'Problema al obtener el nombre de usuario' })
    @Transform(({ value }) => value.toUpperCase().trim()) 
    public usuario: string;
}