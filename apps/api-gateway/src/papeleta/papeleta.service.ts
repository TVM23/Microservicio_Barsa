import { Inject, Injectable } from '@nestjs/common';
import { CreatePapeletaDto } from './dto/create-papeleta.dto';
import { UpdatePapeletaDto } from './dto/update-papeleta.dto';
import { PAPELETA_CLIENT } from './constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { KafkaPublisherService, PAPELETA_PATTERNS } from '@app/contracts';
import { PapeletaPaginationDto } from '@app/contracts';

@Injectable()
export class PapeletaService {
  //constructor(@Inject(PAPELETA_CLIENT) private readonly papeletaClient: ClientProxy ){}
  constructor(private readonly kafkaService: KafkaPublisherService) {}

  getListadoPapeletas(papeletaPaginationDto: PapeletaPaginationDto){
    return this.kafkaService.sendRequest('get-papeleta-listado', papeletaPaginationDto)
  }

  getPapeletaPorFolio(folio: number){
    return this.kafkaService.sendRequest('get-papeleta-folio', folio)
  }

  create(createPapeletaDto: CreatePapeletaDto) {
    return 'This action adds a new papeleta';
  }

  findAll() {
    return `This action returns all papeleta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} papeleta`;
  }

  update(id: number, updatePapeletaDto: UpdatePapeletaDto) {
    return `This action updates a #${id} papeleta`;
  }

  remove(id: number) {
    return `This action removes a #${id} papeleta`;
  }
}
