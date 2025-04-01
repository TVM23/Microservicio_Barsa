import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRequest } from "@app/contracts";
import { IsIn, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserDto extends PartialType(CreateUserRequest) {

    @IsOptional()
    @IsString()
    @IsIn(['true', 'false'], { message: 'El estado solo puede ser "true" o "false".' })
    @Transform(({ value }) => value.trim())  
    public estado?: string
}