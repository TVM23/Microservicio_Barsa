import { PartialType } from '@nestjs/mapped-types';
import { CreatePapeletaDto } from './create-papeleta.dto';

export class UpdatePapeletaDto extends PartialType(CreatePapeletaDto) {}
