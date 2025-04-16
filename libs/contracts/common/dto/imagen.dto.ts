import { IsNotEmpty, IsString, isString } from "class-validator";

export class ImagenDto {

    @IsString()
    @IsNotEmpty()
    public url: string;
    
    @IsString()
    @IsNotEmpty()
    public public_id: string;
}