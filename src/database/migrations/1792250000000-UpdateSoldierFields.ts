import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateSoldierFields1792250000000 implements MigrationInterface {
  name = 'UpdateSoldierFields1792250000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "temporary_soldiers" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "lastName" varchar NOT NULL DEFAULT (''),
        "lastNameGenitive" varchar NOT NULL DEFAULT (''),
        "lastNameSearch" varchar NOT NULL DEFAULT (''),
        "firstName" varchar NOT NULL DEFAULT (''),
        "patronymic" varchar NOT NULL DEFAULT (''),
        "rank" varchar NOT NULL DEFAULT (''),
        "position" varchar NOT NULL DEFAULT (''),
        "positionGenitive" varchar NOT NULL DEFAULT (''),
        "platoon" varchar NOT NULL DEFAULT (''),
        "platoonGenitive" varchar NOT NULL DEFAULT (''),
        "squad" varchar NOT NULL DEFAULT (''),
        "weapon" varchar NOT NULL DEFAULT (''),
        "phone" varchar NOT NULL DEFAULT (''),
        "address" varchar NOT NULL DEFAULT (''),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      INSERT INTO "temporary_soldiers" (
        "id",
        "lastName",
        "lastNameGenitive",
        "lastNameSearch",
        "firstName",
        "patronymic",
        "rank",
        "position",
        "positionGenitive",
        "platoon",
        "platoonGenitive",
        "squad",
        "weapon",
        "phone",
        "address",
        "createdAt",
        "updatedAt"
      )
      SELECT
        "id",
        COALESCE("lastName", ''),
        COALESCE("lastNameGenitive", ''),
        COALESCE("lastNameSearch", ''),
        COALESCE("firstName", ''),
        COALESCE("patronymic", ''),
        COALESCE("rank", ''),
        COALESCE("position", ''),
        COALESCE("positionGenitive", ''),
        COALESCE("platoon", ''),
        '',
        COALESCE("squad", ''),
        COALESCE("weapon", ''),
        COALESCE("phone", ''),
        COALESCE("address", ''),
        "createdAt",
        "updatedAt"
      FROM "soldiers"
    `);

    await queryRunner.query(`
      DROP TABLE "soldiers"
    `);

    await queryRunner.query(`
      ALTER TABLE "temporary_soldiers"
      RENAME TO "soldiers"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "temporary_soldiers" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "lastName" varchar NOT NULL,
        "lastNameGenitive" varchar NOT NULL DEFAULT (''),
        "lastNameSearch" varchar NOT NULL DEFAULT (''),
        "firstName" varchar NOT NULL,
        "patronymic" varchar,
        "rank" varchar NOT NULL,
        "position" varchar NOT NULL,
        "positionGenitive" varchar NOT NULL DEFAULT (''),
        "platoon" varchar NOT NULL,
        "squad" varchar NOT NULL,
        "weapon" varchar NOT NULL DEFAULT (''),
        "phone" varchar NOT NULL,
        "address" varchar NOT NULL DEFAULT (''),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    await queryRunner.query(`
      INSERT INTO "temporary_soldiers" (
        "id",
        "lastName",
        "lastNameGenitive",
        "lastNameSearch",
        "firstName",
        "patronymic",
        "rank",
        "position",
        "positionGenitive",
        "platoon",
        "squad",
        "weapon",
        "phone",
        "address",
        "createdAt",
        "updatedAt"
      )
      SELECT
        "id",
        "lastName",
        "lastNameGenitive",
        "lastNameSearch",
        "firstName",
        "patronymic",
        "rank",
        "position",
        "positionGenitive",
        "platoon",
        "squad",
        "weapon",
        "phone",
        "address",
        "createdAt",
        "updatedAt"
      FROM "soldiers"
    `);

    await queryRunner.query(`
      DROP TABLE "soldiers"
    `);

    await queryRunner.query(`
      ALTER TABLE "temporary_soldiers"
      RENAME TO "soldiers"
    `);
  }
}
