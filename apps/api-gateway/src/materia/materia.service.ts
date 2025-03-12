import { Inject, Injectable } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { MATERIA_CLIENT } from './constant';
import { ClientProxy, ClientProxyFactory, RpcException, Transport } from '@nestjs/microservices';
import { MATERIA_PATTERNS } from 'libs/contracts/materia/materia.patterns';
import { catchError, timeout } from 'rxjs';
import { KafkaPublisherService, MateriaPaginationDto } from '@app/contracts';

@Injectable()
export class MateriaService {
  //constructor(@Inject(MATERIA_CLIENT) private materiaClient: ClientProxy){}
  constructor(private readonly kafkaService: KafkaPublisherService) {}

  getListadoMateria(){
    return this.kafkaService.sendRequest('get-listado-materia', "")      
  }

  getListadoMateriaFiltro(dtoMateriaPaginado: MateriaPaginationDto){
    return this.kafkaService.sendRequest('get-listado-materia-filtro', dtoMateriaPaginado)
  }

  getMateriaPorCodigo(codigo: string) {
    return this.kafkaService.sendRequest('get-materia-codigo', codigo)
  }

  create(createMateriaDto: CreateMateriaDto) {
    return 'This action adds a new materia';
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
