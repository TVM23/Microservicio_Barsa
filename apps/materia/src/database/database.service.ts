import { Logger, Module } from '@nestjs/common';
import * as odbc from 'odbc';
import { envs } from '@app/contracts'; // Asegúrate de que esta parte esté bien configurada

export const MateriaDatabaseProvider = {
  provide: 'ODBC_CONNECTION',
  useFactory: async () => {
    const logger = new Logger('Database Materia Service');
    try {
      const connection = await odbc.connect(envs.dsn);
      logger.log('Conectado a la base de datos Access');
      return connection;
    } catch (error) {
      logger.error('Error al conectar a la base de datos:', error);
      throw error;
    }
  },
};

@Module({
  providers: [MateriaDatabaseProvider],
  exports: [MateriaDatabaseProvider],
})
export class MateriaDatabaseService {}
