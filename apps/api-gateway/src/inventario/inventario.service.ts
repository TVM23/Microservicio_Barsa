import { KafkaPublisherService, MovimientoMateriaPagiDto, MovimientoProductoPagiDto } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { MovimientoMateriaCompDto } from './dto/movimiento-materia.dto';
import { MovimientoCompDto } from './dto/movimientos.dto';

@Injectable()
export class InventarioService {
    constructor(private readonly kafkaService: KafkaPublisherService) {}

    getListadoMovimientoMateria(paginationDTO: MovimientoMateriaPagiDto) {
        return this.kafkaService.sendRequest('get-movimiento-materia', paginationDTO)
    }

    getListadoMovimientoProducto(paginationDTO: MovimientoProductoPagiDto){
        return this.kafkaService.sendRequest('get-movimiento-producto', paginationDTO)
    }
    
    createMovimientoMateria(movimientoMateriaDto: MovimientoMateriaCompDto){
        return this.kafkaService.sendRequest('post-movimiento-materia', movimientoMateriaDto)
    }

    createMovimientoProducto(movimientoProductoDto: MovimientoCompDto){
        return this.kafkaService.sendRequest('post-movimiento-producto', movimientoProductoDto)
    }

}
