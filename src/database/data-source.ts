import 'reflect-metadata';

import { DataSource } from 'typeorm';

import { Document } from '../documents/entities/document.entity';
import { Requisites } from '../requisites/entities/requisites.entity';
import { Soldier } from '../soldiers/entities/soldier.entity';
import { Task } from '../tasks/entities/task.entity';
import { getDatabasePath } from '../storage/storage-paths';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.MIGRATION_DB_PATH || getDatabasePath(),

  entities: [Soldier, Requisites, Document, Task],

  migrations: ['src/database/migrations/*.ts'],

  synchronize: false,
});
