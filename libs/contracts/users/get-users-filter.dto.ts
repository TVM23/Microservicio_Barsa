import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GetUsersFiltersDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())  
  public nombre?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())  
  public nombreUsuario?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())  
  public email?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())  
  public rol?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())  
  public estado?: string;
}
