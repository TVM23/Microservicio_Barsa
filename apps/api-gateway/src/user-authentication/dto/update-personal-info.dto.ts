import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UpdatePersonalInfoDto {
    
    @IsString({message: "Ingresa tu nombre de usuario"})
    @IsNotEmpty({message: "El nombre de usuario no puede ir vacio"})
    public nombreUsuario: string;
    
    @IsOptional()
    @Matches(/^$|^.+@.+\..+$/, { message: "Debes ingresar un correo válido o dejarlo vacío" })
    public email: string;
    
}