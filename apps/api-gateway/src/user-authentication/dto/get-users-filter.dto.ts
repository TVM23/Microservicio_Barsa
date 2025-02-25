import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class GetUsersFiltersDto {
  @IsOptional()
  @IsString()
  public nombre?: string;

  @IsOptional()
  @IsString()
  public email?: string;

  @IsOptional()
  @IsString()
  public rol?: string;

  @IsOptional()
  @IsString()
  public estado?: string;
}
