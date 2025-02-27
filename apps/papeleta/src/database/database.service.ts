import { envs } from '@app/contracts';
import { Logger, Module } from '@nestjs/common';
import * as odbc from 'odbc';

export const PapeletaDatabaseProvider = {
  provide: 'ODBC_CONNECTION',
  useFactory: async () => {
    const logger = new Logger('Database Products Service')
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
  providers: [PapeletaDatabaseProvider],
  exports: [PapeletaDatabaseProvider],
})
export class PapeletaDatabaseService {}