import { PartialType } from '@nestjs/mapped-types';
import { CreateMuebleDto } from './create-mueble.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateMuebleDto extends PartialType(CreateMuebleDto) {

}

