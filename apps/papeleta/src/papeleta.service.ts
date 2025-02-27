import { Inject, Injectable } from '@nestjs/common';
import { PapeletaDatabaseService } from './database/database.service';
import { RpcException } from '@nestjs/microservices';
import { PapeletaPaginationDto } from '@app/contracts';
import { last } from 'rxjs';

@Injectable()
export class PapeletaService {
  constructor(@Inject('ODBC_CONNECTION') private readonly dbConnection ){}

  async getListadoPapeletas(papeletaPaginationDto: PapeletaPaginationDto){
    try {
      
      const { page, limit } = papeletaPaginationDto;
      const pageValue = page ?? 1;
      const limitValue = limit ?? 10;
      const offset = (pageValue - 1) * limitValue;

      let query = ` FROM Papeleta WHERE 1=1`;

      if (papeletaPaginationDto.tipoId) {
        query += ` AND TipoId = '${papeletaPaginationDto.tipoId}'`;
      }
      if (papeletaPaginationDto.folio) {
        query += ` AND Folio = ${papeletaPaginationDto.folio}`;
      }
      if (papeletaPaginationDto.fecha) {
        query += ` AND Fecha = #${papeletaPaginationDto.fecha}#`;
      }
      if (papeletaPaginationDto.status) {
        query += ` AND Status = '${papeletaPaginationDto.status}'`;
      }
      if (papeletaPaginationDto.observacionGeneral) {
        query += ` AND ObservacionGeneral LIKE '%${papeletaPaginationDto.observacionGeneral}%'`;
      }

      const totalResult = await this.dbConnection.query("SELECT COUNT(*) AS total "+query);
      const totalItems = totalResult[0].total;
      const totalPages = Math.ceil(totalItems / limitValue);

      const data = await this.dbConnection.query(`
        SELECT * FROM (
           SELECT TOP ${limit} *
           FROM (
             ${`SELECT TOP ${offset + limitValue} *`+query}
             ORDER BY Folio ASC
           ) subquery
           ORDER BY Folio DESC
         ) subquery
         ORDER BY Folio ASC
       `);

      return {
        totalItems,
        totalPages: totalPages,
        currentPage: pageValue,
        data,
      };
    } catch (error) {
      throw new RpcException({
        message: `Error en la base de datos`,
        error: 'Unauthorized',
        status: 403
      });
    }
  }
}
