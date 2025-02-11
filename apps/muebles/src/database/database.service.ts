// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Module, Logger } from '@nestjs/common';
import * as odbc from 'odbc';
import { envs } from '@app/contracts';


/* @Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private db: odbc.Connection;

  async onModuleInit() {
    this.db = await odbc.connect(envs.dsn);
    console.log('Conectado a Access');
  }

  async query(sql: string) {
    return this.db.query(sql);
  }

  async onModuleDestroy() {
    await this.db.close();
  }
} */

export const databaseProvider = {
  provide: 'ODBC_CONNECTION',
  useFactory: async () => {
    const logger = new Logger('Database Service')
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
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseService {}
