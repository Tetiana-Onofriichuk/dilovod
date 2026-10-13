import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1791885397090 implements MigrationInterface {
    name = 'InitialSchema1791885397090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "soldiers" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "lastName" varchar NOT NULL, "lastNameGenitive" varchar NOT NULL DEFAULT (''), "lastNameSearch" varchar NOT NULL DEFAULT (''), "firstName" varchar NOT NULL, "patronymic" varchar, "rank" varchar NOT NULL, "position" varchar NOT NULL, "positionGenitive" varchar NOT NULL DEFAULT (''), "platoon" varchar NOT NULL, "squad" varchar NOT NULL, "weapon" varchar NOT NULL DEFAULT (''), "phone" varchar NOT NULL, "address" varchar NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "type" varchar NOT NULL, "fileName" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "requisites" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "companyCommanderPosition" varchar NOT NULL DEFAULT (''), "companyCommanderRank" varchar NOT NULL DEFAULT (''), "companyCommanderFirstName" varchar NOT NULL DEFAULT (''), "companyCommanderPatronymic" varchar NOT NULL DEFAULT (''), "companyCommanderLastName" varchar NOT NULL DEFAULT (''), "companyCommanderLastNameGenitive" varchar NOT NULL DEFAULT (''), "unitCommanderPosition" varchar NOT NULL DEFAULT (''), "unitCommanderRank" varchar NOT NULL DEFAULT (''), "unitCommanderFirstName" varchar NOT NULL DEFAULT (''), "unitCommanderLastName" varchar NOT NULL DEFAULT (''), "financeChiefPosition" varchar NOT NULL DEFAULT (''), "financeChiefRank" varchar NOT NULL DEFAULT (''), "financeChiefFirstName" varchar NOT NULL DEFAULT (''), "financeChiefLastName" varchar NOT NULL DEFAULT (''))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar NOT NULL, "description" varchar NOT NULL DEFAULT (''), "date" date NOT NULL, "completed" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "document_soldiers" ("documentId" integer NOT NULL, "soldierId" integer NOT NULL, PRIMARY KEY ("documentId", "soldierId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c39079d8ba2f743e75b47c4543" ON "document_soldiers" ("documentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_92be8bc6ee086aa129f88b61f4" ON "document_soldiers" ("soldierId") `);
        await queryRunner.query(`DROP INDEX "IDX_c39079d8ba2f743e75b47c4543"`);
        await queryRunner.query(`DROP INDEX "IDX_92be8bc6ee086aa129f88b61f4"`);
        await queryRunner.query(`CREATE TABLE "temporary_document_soldiers" ("documentId" integer NOT NULL, "soldierId" integer NOT NULL, CONSTRAINT "FK_c39079d8ba2f743e75b47c45438" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_92be8bc6ee086aa129f88b61f4a" FOREIGN KEY ("soldierId") REFERENCES "soldiers" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("documentId", "soldierId"))`);
        await queryRunner.query(`INSERT INTO "temporary_document_soldiers"("documentId", "soldierId") SELECT "documentId", "soldierId" FROM "document_soldiers"`);
        await queryRunner.query(`DROP TABLE "document_soldiers"`);
        await queryRunner.query(`ALTER TABLE "temporary_document_soldiers" RENAME TO "document_soldiers"`);
        await queryRunner.query(`CREATE INDEX "IDX_c39079d8ba2f743e75b47c4543" ON "document_soldiers" ("documentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_92be8bc6ee086aa129f88b61f4" ON "document_soldiers" ("soldierId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_92be8bc6ee086aa129f88b61f4"`);
        await queryRunner.query(`DROP INDEX "IDX_c39079d8ba2f743e75b47c4543"`);
        await queryRunner.query(`ALTER TABLE "document_soldiers" RENAME TO "temporary_document_soldiers"`);
        await queryRunner.query(`CREATE TABLE "document_soldiers" ("documentId" integer NOT NULL, "soldierId" integer NOT NULL, PRIMARY KEY ("documentId", "soldierId"))`);
        await queryRunner.query(`INSERT INTO "document_soldiers"("documentId", "soldierId") SELECT "documentId", "soldierId" FROM "temporary_document_soldiers"`);
        await queryRunner.query(`DROP TABLE "temporary_document_soldiers"`);
        await queryRunner.query(`CREATE INDEX "IDX_92be8bc6ee086aa129f88b61f4" ON "document_soldiers" ("soldierId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c39079d8ba2f743e75b47c4543" ON "document_soldiers" ("documentId") `);
        await queryRunner.query(`DROP INDEX "IDX_92be8bc6ee086aa129f88b61f4"`);
        await queryRunner.query(`DROP INDEX "IDX_c39079d8ba2f743e75b47c4543"`);
        await queryRunner.query(`DROP TABLE "document_soldiers"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "requisites"`);
        await queryRunner.query(`DROP TABLE "documents"`);
        await queryRunner.query(`DROP TABLE "soldiers"`);
    }

}
