import { PartialType } from "@nestjs/mapped-types";
import { CreateUserRequest } from "@app/contracts";
import { IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateUserDto extends PartialType(CreateUserRequest) {

    @IsOptional()
    @IsString()
    @Transform(({ value }) => value.trim())  
    public estado?: string
}