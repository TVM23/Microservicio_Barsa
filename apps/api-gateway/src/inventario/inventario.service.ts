import { InventarioEntradasPaginationDto, KafkaPublisherService } from '@app/contracts';
import { Injectable } from '@nestjs/common';
import { InventarioSalidaCompDTO } from './dto/inventario-salida.dto';
import { InventarioEntradaCompDTO } from './dto/inventario-entrada.dto';

@Injectable()
export class InventarioService {
    constructor(private readonly kafkaService: KafkaPublisherService) {}

    getEntradasInventario(paginationDTO: InventarioEntradasPaginationDto) {
        return this.kafkaService.sendRequest('get-inventario-entradas', paginationDTO)
    }

    createSalidaInventario(crearFichaDto: InventarioSalidaCompDTO) {
        return this.kafkaService.sendRequest('post-salida-crear', crearFichaDto)
    }

    createEntradaInventario(crearFichaDto: InventarioEntradaCompDTO) {
        return this.kafkaService.sendRequest('post-entrada-crear', crearFichaDto)
    }

}
