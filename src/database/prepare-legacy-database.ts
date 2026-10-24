import Database from 'better-sqlite3';
import { existsSync } from 'fs';

import { getDatabasePath } from '../storage/storage-paths';

const INITIAL_MIGRATION_TIMESTAMP = 1791885397090;
const INITIAL_MIGRATION_NAME = 'InitialSchema1791885397090';

export const prepareLegacyDatabase = (): void => {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const databasePath = getDatabasePath();

  if (!existsSync(databasePath)) {
    return;
  }

  const database = new Database(databasePath);

  try {
    const soldiersTable = database
      .prepare(
        `
          SELECT name
          FROM sqlite_master
          WHERE type = 'table'
            AND name = 'soldiers'
        `,
      )
      .get();

    // Нова/порожня БД — нехай TypeORM сам виконає InitialSchema.
    if (!soldiersTable) {
      return;
    }

    const migrationsTable = database
      .prepare(
        `
          SELECT name
          FROM sqlite_master
          WHERE type = 'table'
            AND name = 'migrations'
        `,
      )
      .get();

    if (!migrationsTable) {
      database.exec(`
        CREATE TABLE "migrations" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "timestamp" bigint NOT NULL,
          "name" varchar NOT NULL
        )
      `);
    }

    const initialMigration = database
      .prepare(
        `
          SELECT id
          FROM migrations
          WHERE timestamp = ?
             OR name = ?
          LIMIT 1
        `,
      )
      .get(INITIAL_MIGRATION_TIMESTAMP, INITIAL_MIGRATION_NAME);

    if (initialMigration) {
      return;
    }

    database
      .prepare(
        `
          INSERT INTO migrations ("timestamp", "name")
          VALUES (?, ?)
        `,
      )
      .run(INITIAL_MIGRATION_TIMESTAMP, INITIAL_MIGRATION_NAME);

    console.log(
      'Legacy OPORA database detected. Initial migration baseline registered.',
    );
  } finally {
    database.close();
  }
};
