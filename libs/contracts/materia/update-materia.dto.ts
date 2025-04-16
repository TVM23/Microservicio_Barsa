import { CreateMateriaDto } from "@app/contracts";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateMateriaDto extends PartialType(CreateMateriaDto) {}
