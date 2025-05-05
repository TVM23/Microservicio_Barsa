import { Injectable } from '@nestjs/common';
import { KafkaPublisherService, MateriaPaginationDto, CreateMateriaDto, UpdateMateriaDto } from '@app/contracts';

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

  updateMateria(updateMateriaDto: UpdateMateriaDto) {
    return this.kafkaService.sendRequest('put-materia-update', updateMateriaDto)
  }

  borrarMateria(codigoMat: string) {
    return this.kafkaService.sendRequest('delete-materia-borrar', codigoMat);
  }

}
