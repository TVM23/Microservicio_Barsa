import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, Min } from 'class-validator';

export class CreateMuebleDto {
  @IsString()
  public nombre: string;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @Type(() => Number)
  public stock: number;

  @IsNumber({}, { message: 'El ID de color debe ser un número' })
  @Type(() => Number)
  public color_Id: number;

  @IsBoolean()
  @Type(() => Boolean)
  public estado: boolean;
}
