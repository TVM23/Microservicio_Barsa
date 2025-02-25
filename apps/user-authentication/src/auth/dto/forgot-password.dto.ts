import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordDto {

    @IsEmail({}, {message: "Debes ingresar un correo válidp"})
    email: string
}