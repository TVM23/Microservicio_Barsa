import { Injectable } from '@nestjs/common';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { KafkaPublisherService, MateriaPaginationDto, CreateMateriaDto } from '@app/contracts';

@Injectable()
export class MateriaService {
  //constructor(@Inject(MATERIA_CLIENT) private materiaClient: ClientProxy){}
  constructor(private readonly kafkaService: KafkaPublisherService) {}

  getListadoMateria(){
    return this.kafkaService.sendRequest('get-materia-listado', "")      
  }

  getListadoMateriaFiltro(dtoMateriaPaginado: MateriaPaginationDto){
    return this.kafkaService.sendRequest('get-materia-listado-filtro', dtoMateriaPaginado)
  }

  getMateriaPorCodigo(codigo: string) {
    return this.kafkaService.sendRequest('get-materia-codigo', codigo)
  }

  createMateria(createMateriaDto: CreateMateriaDto) {
    return this.kafkaService.sendRequest('post-materia-crear', createMateriaDto)
  }

  findAll() {
    return `This action returns all materia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} materia`;
  }

  update(id: number, updateMateriaDto: UpdateMateriaDto) {
    return `This action updates a #${id} materia`;
  }

  remove(id: number) {
    return `This action removes a #${id} materia`;
  }
}
