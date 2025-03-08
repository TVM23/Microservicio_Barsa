import { Inject, Injectable } from '@nestjs/common';
import { MateriaPaginationDto } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';
import { Console } from 'console';

@Injectable()
export class MateriaService {
  constructor(@Inject('ODBC_CONNECTION') private readonly dbConection){}

  async getListadoMateria(materiaPaginationDto: MateriaPaginationDto){
    try {
   
      const { page, limit } = materiaPaginationDto;
      const pageValue = page ?? 1;
      const limitValue = limit ?? 10;
      const offset = (pageValue - 1) * limitValue;
    
      //let query = `FROM Materia'`;

      

      const sql = 'SELECT COUNT(*) FROM Materia';
      const sql2 = "SELECT TOP 5 CodigoMat FROM Materia WHERE CodigoMat LIKE '%TAP%' AND Descripcion LIKE '%TABLA%'"
      console.log('Consulta generada:', sql2);
      return await this.dbConection.query(sql2);

      /*const sql = 'SELECT TOP 5 * FROM Materia';
      const sql = 'SELECT TOP 10 * FROM Materia WHERE 1=1';
      const res = await this.dbConection.query(sql);
      console.log('Consulta generada:', sql);
      const sql2 = `SELECT TOP ${offset + limitValue} * ${query}`
      return await this.dbConection.query(sql);
    
      if (materiaPaginationDto.codigoMat) {
        query += ` AND CodigoMat LIKE '%${materiaPaginationDto.codigoMat}%'`;
      }
      if (materiaPaginationDto.descripcion) {
        query += ` AND Descripcion LIKE '%${materiaPaginationDto.descripcion}%'`;
      }
      if (materiaPaginationDto.unidad) {
        query += ` AND Unidad LIKE '%${materiaPaginationDto.unidad}%'`;
      }
      if (materiaPaginationDto.proceso) {
        query += ` AND Proceso = '${materiaPaginationDto.proceso}'`;
      }
      if (materiaPaginationDto.borrado) {
        query += ` AND Borrado = ${materiaPaginationDto.borrado}`;
      }
    
      const totalResult = await this.dbConection.query("SELECT COUNT(*) " + query);
      console.log("addaw "+totalResult)
      const totalItems = totalResult[0].total;
      const totalPages = Math.ceil(totalItems / limitValue);

    
      /*const data = await this.dbConection.query(`
        SELECT * ${query} 
        WHERE CodigoMat IN (
          SELECT TOP ${limitValue} CodigoMat FROM (
            SELECT TOP ${offset + limitValue} CodigoMat ${query}
            ORDER BY CodigoMat ASC
          ) AS t
          ORDER BY CodigoMat DESC
        )
        ORDER BY CodigoMat ASC
      `);*/
      /*console.log("psadaea "+`SELECT TOP ${offset + limitValue} * ${query}`)
      const data = await this.dbConection.query(`SELECT TOP ${offset + limitValue} * ${query}`)
      
      return {
        totalItems,
        totalPages: totalPages,
        currentPage: pageValue,
        data,
      };*/

    } catch (error) {
      throw new RpcException({
        message: `Error en la base de datos`,
        error: 'Unauthorized',
        status: error
      });
    }
  }
}
