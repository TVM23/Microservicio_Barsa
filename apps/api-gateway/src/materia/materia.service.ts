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

  createMateria(createMateriaDto: CreateMateriaDto, usuario: string) {
    return this.kafkaService.sendRequest('post-materia-crear', { createMateriaDto, usuario  })
  }

  updateMateria(updateMateriaDto: UpdateMateriaDto, usuario: string) {
    return this.kafkaService.sendRequest('put-materia-update', { updateMateriaDto, usuario })
  }

  borrarMateria(codigoMat: string, usuario: string) {
    return this.kafkaService.sendRequest('delete-materia-borrar', { codigoMat, usuario });
  }

}
