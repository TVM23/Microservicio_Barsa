import { Inject, Injectable } from '@nestjs/common';
import { CreatePapeletaDto } from './dto/create-papeleta.dto';
import { UpdatePapeletaDto } from './dto/update-papeleta.dto';
import { PAPELETA_CLIENT } from './constant';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PAPELETA_PATTERNS } from '@app/contracts';
import { PapeletaPaginationDto } from '@app/contracts';

@Injectable()
export class PapeletaService {
  constructor(@Inject(PAPELETA_CLIENT) private readonly papeletaClient: ClientProxy ){}

  getListadoPapeletas(papeletaPaginationDto: PapeletaPaginationDto){
    return this.papeletaClient.send(PAPELETA_PATTERNS.GET_LISTADO_PAPELETAS, papeletaPaginationDto )
        .pipe(
        catchError( err => { throw new RpcException(err) } )
    );
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
