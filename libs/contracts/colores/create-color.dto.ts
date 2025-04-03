import { Transform } from "class-transformer";
import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateColorDto {

    @IsString({ message: 'La descripción debe ser un texto válido.' })
    @IsNotEmpty({ message: 'No puedes poner la descripcion vacia' })
    @Transform(({ value }) => value.toUpperCase().trim())  
    public descripcion: string;

    @IsString({ message: 'El estado debe ser un valor válido.' })
    @Transform(({ value }) => value ? value.trim() : 'true') 
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' })
    public borrado: string = 'false';
}