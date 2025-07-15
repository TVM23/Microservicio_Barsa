import { Transform, Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { ImagenDto, IsGreaterThan } from "@app/contracts";

export class UpdateMateriaDto {
    @IsString({message: 'Debes ingresar un texto valido'})
    @Transform(({ value }) => value.toUpperCase().trim())  
    @IsNotEmpty({ message: 'No puedes poner la descripcion vacia' })
    public descripcion: string;
    
    @IsString({message: 'Debes ingresar un texto valido'})
    @Transform(({ value }) => value.toUpperCase().trim())  
    @IsNotEmpty({ message: 'No puedes poner la unidad de la materia vacia' })
    public unidad: string;
    
    @IsNumber({}, { message: 'El precio de compra debe ser un número' })
    @Min(0, { message: 'El precio de compra no puede ser negativo' })
    @Type(() => Number)
    public pcompra: number
    
    @IsNumber({}, { message: 'La existencia debe ser un número' })
    @Min(0, { message: 'La cantidad de existencia no puede ser negativo' })
    @Type(() => Number)
    public existencia: number
    
    @IsNumber({}, { message: 'La cantidad minima del material debe ser un número' })
    @Min(0, { message: 'La cantidad minima del material no puede ser negativo' })
    @Type(() => Number)
    public min: number
    
    @IsNumber({}, { message: 'La cantidad máxima del material debe ser un número' })
    @Min(0, { message: 'La cantidad máxima del material no puede ser negativo' })
    @IsGreaterThan('min', { message: 'El valor máximo debe ser mayor o igual al mínimo' })
    @Type(() => Number)
    public max: number
    
    @IsNumber({}, { message: 'La cantidad del inventario inicial debe ser un número' })
    @Min(0, { message: 'La cantidad del inventario inicial no puede ser negativo' })
    @Type(() => Number)
    public inventarioInicial: number
    
    @IsString({message: 'Debes ingresar un texto valido'})
    @Transform(({ value }) => value.toUpperCase().trim())  
    @IsNotEmpty({ message: 'No puedes poner la unidad de entrada vacia' })
    public unidadEntrada: string;
    
    @IsNumber({}, { message: 'La cantidad debe ser un número' })
    @Min(0, { message: 'La cantidad de existencia por unidad no puede ser negativo' })
    @Type(() => Number)
    public cantxunidad: number
    
    @IsString({message: 'Debes ingresar un texto valido'})
    @Transform(({ value }) => value.toUpperCase().trim())  
    @IsNotEmpty({ message: 'No puedes poner el proceso vacio' })
    @IsIn(['E', 'M', 'T', 'P'], { message: 'Se debe ingrsar un proceso valido' }) 
    public proceso: string;
    
    @IsString({ message: 'El estado debe ser un valor válido.' })
    @Transform(({ value }) => value ? value.trim() : 'true') 
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser true o false' })
    public borrado: string = 'false';

    @IsNumber({}, {message: 'Debes ingresar un numero para el porcentaje de la merma'})
    @IsInt({ message: 'El porcentaje de la merma debe ser un entero válido.' })
    @Min(0, { message: 'La cantidad de merma no puede ser un porcentaje negativo' })
    @Max(100, { message: 'La cantidad de merma no puede sobre pasar del 100%' })
    @Type(() => Number)
    public merma: number = 0;
    
    @IsOptional()
    public imagenes?: ImagenDto[];
}
