import { InventarioEntradaDTO } from "@app/contracts";
import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class InventarioEntradaCompDTO  extends PartialType(InventarioEntradaDTO) {
    @IsOptional()
    @IsString({ message: 'Problema al obtener el nombre de usuario' })
    @Transform(({ value }) => value.trim()) 
    public createdBy: string;
}