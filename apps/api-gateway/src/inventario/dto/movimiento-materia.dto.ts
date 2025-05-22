import { MovimientoMateriaDto } from "@app/contracts";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class MovimientoMateriaCompDto  extends PartialType(MovimientoMateriaDto) {
    @IsString({ message: 'Problema al obtener el nombre de usuario' })
    @Transform(({ value }) => value.toUpperCase().trim()) 
    public usuario: string;
}