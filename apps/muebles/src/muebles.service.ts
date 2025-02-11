import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateMuebleDto, UpdateMuebleDto } from '@app/contracts';
import { PaginationDto } from '@app/contracts';
import { RpcException } from '@nestjs/microservices';
import { error } from 'console';

@Injectable()
export class MueblesService {
  constructor(@Inject('ODBC_CONNECTION') private readonly db) {}

  // Obtener todos los muebles
  async getMuebles() {
    try {
      return await this.db.query('SELECT * FROM Muebles');
    } catch (error) {
      console.error('Error al obtener los muebles:', error);
      throw error;
    }
  }

  //Obtener muebles paginado
  async getMueblesPaginado(paginationDto: PaginationDto){
    try {
      const { page, limit } = paginationDto;
      const pageValue = page ?? 1;
      const limitValue = limit ?? 10;
      const offset = (pageValue - 1) * limitValue;
      // Obtener el total de registros
      const totalResult = await this.db.query('SELECT COUNT(*) AS total FROM Muebles');
      const totalItems = totalResult[0].total;

      // Consulta con paginación
      const data = await this.db.query(`
       SELECT * FROM (
          SELECT TOP ${limit} *
          FROM (
            SELECT TOP ${offset + limitValue} *
            FROM Muebles
            ORDER BY Id ASC
          ) subquery
          ORDER BY Id DESC
        ) subquery
        ORDER BY Id ASC
      `);

      return {
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / limitValue),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error al obtener los muebles paginados:', error);
      throw error;
    }
  }


  //Obtener mueble por id
  async getMuebleById(id: number) {
    try {
      const mueble = await this.db.query(`SELECT * FROM Muebles WHERE id = ${id}`);
      if (!mueble[0]){
        throw new RpcException({
          message: `No se encontro el producto con el id: ${id}`,
          status: HttpStatus.BAD_REQUEST
        })
      }
      return mueble[0];
    } catch (error) {
      console.error('Error al obtener mueble por ID:', error);
      throw error;
    }
  }

  // Crear un nuevo mueble
  async createMueble(createMuebleDto: CreateMuebleDto) {
    try {
      const { nombre, stock, color_Id, estado } = createMuebleDto;
      
      await this.db.query(
        `INSERT INTO Muebles (Nombre, Stock, Color_Id, Estado) VALUES ('${nombre}', ${stock}, ${color_Id}, ${estado})`
      );

      return { message: 'Mueble agregado correctamente' };
    } catch (error) {
      console.error('Error al agregar mueble:', error);
      throw error;
    }
  }

  // Método para actualizar un mueble
  async updateMueble(id: number, updateMuebleDto: UpdateMuebleDto) {

    const {id: _, ...data} = updateMuebleDto

    const fieldsToUpdate = Object.entries(data)
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key} = '${value.replace(/'/g, "''")}'`; // Escapar comillas
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        return `${key} = ${value}`;
      } else if (value === null) {
        return `${key} = NULL`;
      }
      throw new RpcException({
        message: `Tipo de dato no soportado en el campo ${key}`,
        status: HttpStatus.BAD_REQUEST
      });
    })
    .join(', ');

    const query = `UPDATE Muebles SET ${fieldsToUpdate} WHERE ID = ${id}`;

    try {
      //Checa que elm nueble si exista en el registro
      const mueble = await this.db.query(`SELECT * FROM Muebles WHERE id = ${id}`);
      if (!mueble[0]){
        throw new RpcException({
          message: `No se encontro el producto con el id: ${id}`,
          status: HttpStatus.BAD_REQUEST
        })
      }
      await this.db.query(query); // Ejecuta la consulta
      return { message: 'Mueble actualizado correctamente' };
    } catch (error) {
      console.error('Error al actualizar mueble:', error);
      throw error;
    }
  }

  //Cambiar estado del mueble 
  async changeEstadoMueble(id:number){
    try{
      const mueble = await this.db.query(`SELECT * FROM Muebles WHERE id = ${id}`);
      if (!mueble[0]){
        throw new RpcException({
          message: `No se encontro el producto con el id: ${id}`,
          status: HttpStatus.BAD_REQUEST
        })
      }

      // Obtener el estado actual del mueble y convertirlo a número
      const estadoResult = await this.db.query(`SELECT Estado FROM Muebles WHERE Id = ${id}`);
      const currentEstado = Number(estadoResult[0].Estado);

      // Realizar el cambio de estado
      const newEstado = currentEstado ? 0 : 1;
      const query = `UPDATE Muebles SET Estado = ${newEstado} Where Id = ${id}`
      await this.db.query(query)
      
      return { message: newEstado ? `Mueble activado correctamente`: `Mueble desactivado correctamente}`};
    } catch (error){
      console.error('Error al desativar el mueble:', error);
      throw error;
    }
  }

  // Eliminar un mueble
  async deleteMueble(id: number) {
    try {
      const mueble = await this.db.query(`SELECT * FROM Muebles WHERE id = ${id}`);
      if (!mueble[0]){
        throw new RpcException({
          message: `No se encontro el producto con el id: ${id}`,
          status: HttpStatus.BAD_REQUEST
        })
      }
      await this.db.query(`DELETE FROM Muebles WHERE id = ${id}`);
      return { message: 'Mueble eliminado correctamente' };
    } catch (error) {
      console.error('Error al eliminar mueble:', error);
      throw error;
    }
  }
}
