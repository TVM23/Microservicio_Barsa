import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UpdatePersonalInfoDto {

    @IsString()
    @Transform(({ value }) => value.trim())  
    public _id: string
    
    @IsString({message: "Ingresa tu nombre de usuario"})
    @IsNotEmpty({message: "El nombre de usuario no puede ir vacio"})
    @Transform(({ value }) => value.trim())  
    public nombreUsuario: string;
    
    @IsOptional()
    @Transform(({ value }) => value.trim())  
    @Matches(/^$|^.+@.+\..+$/, { message: "Debes ingresar un correo válido o dejarlo vacío" })
    public email: string;
    
}