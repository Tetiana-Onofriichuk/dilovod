import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { cpSync, existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import AdmZip from 'adm-zip';
import { DataSource } from 'typeorm';

import { prepareLegacyDatabase } from '../database/prepare-legacy-database';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class BackupService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly storageService: StorageService,
  ) {}

  createBackup(prefix = 'OPORA_backup'): string {
    try {
      const databasePath = this.storageService.getDatabasePath();
      const documentsPath = this.storageService.getDocumentsPath();
      const backupsPath = this.storageService.getBackupsPath();

      if (!existsSync(databasePath)) {
        throw new InternalServerErrorException(
          'Файл бази даних dilovod.sqlite не знайдено',
        );
      }

      if (!existsSync(backupsPath)) {
        mkdirSync(backupsPath, { recursive: true });
      }

      const now = new Date();

      const date = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-');

      const time = [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0'),
      ].join('-');

      const fileName = `${prefix}_${date}_${time}.zip`;
      const backupPath = join(backupsPath, fileName);

      const zip = new AdmZip();

      zip.addLocalFile(databasePath);

      if (existsSync(documentsPath)) {
        zip.addLocalFolder(documentsPath, 'documents');
      }

      zip.writeZip(backupPath);

      return backupPath;
    } catch (error: unknown) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Невідома помилка';

      throw new InternalServerErrorException(
        `Не вдалося створити резервну копію: ${message}`,
      );
    }
  }

  createSafetyBackup(): string {
    return this.createBackup('OPORA_before_restore');
  }

  validateBackup(buffer: Buffer) {
    try {
      const zip = new AdmZip(buffer);
      const entries = zip.getEntries();

      const hasDatabase = entries.some(
        (entry) => entry.entryName === 'dilovod.sqlite',
      );

      if (!hasDatabase) {
        throw new BadRequestException(
          'Некоректна резервна копія: файл dilovod.sqlite не знайдено',
        );
      }

      return {
        valid: true,
        message: 'Резервна копія OPORA успішно перевірена',
      };
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        'Не вдалося прочитати файл резервної копії',
      );
    }
  }

  async restoreBackup(buffer: Buffer) {
    const databasePath = this.storageService.getDatabasePath();
    const documentsPath = this.storageService.getDocumentsPath();
    const tempPath = this.storageService.getBackupTempPath();

    let safetyBackupPath: string | null = null;
    let replacementStarted = false;

    try {
      // 1. Перевіряємо backup до будь-яких змін поточних даних.
      this.validateBackup(buffer);

      // 2. Створюємо повну страховочну копію поточного стану.
      safetyBackupPath = this.createSafetyBackup();

      // 3. Готуємо тимчасову папку.
      if (existsSync(tempPath)) {
        rmSync(tempPath, {
          recursive: true,
          force: true,
        });
      }

      mkdirSync(tempPath, { recursive: true });

      // 4. Розпаковуємо backup у тимчасову папку.
      const zip = new AdmZip(buffer);
      zip.extractAllTo(tempPath, true);

      const restoredDatabasePath = join(tempPath, 'dilovod.sqlite');
      const restoredDocumentsPath = join(tempPath, 'documents');

      // 5. Перевіряємо, що БД справді є після розпакування.
      if (!existsSync(restoredDatabasePath)) {
        throw new BadRequestException('У резервній копії відсутня база даних');
      }

      // 6. Закриваємо поточне з'єднання з SQLite.
      if (this.dataSource.isInitialized) {
        await this.dataSource.destroy();
      }

      replacementStarted = true;

      // 7. Замінюємо БД.
      cpSync(restoredDatabasePath, databasePath);

      // 8. Замінюємо документи.
      if (existsSync(documentsPath)) {
        rmSync(documentsPath, {
          recursive: true,
          force: true,
        });
      }

      if (existsSync(restoredDocumentsPath)) {
        cpSync(restoredDocumentsPath, documentsPath, {
          recursive: true,
        });
      } else {
        mkdirSync(documentsPath, { recursive: true });
      }

      // 9. Якщо backup був створений старою версією OPORA,
      // реєструємо InitialSchema як базову migration.
      prepareLegacyDatabase();

      // 10. Відкриваємо відновлену БД.
      // TypeORM автоматично виконає всі наступні migrations.
      await this.dataSource.initialize();

      replacementStarted = false;

      // 11. Прибираємо тимчасові файли.
      if (existsSync(tempPath)) {
        rmSync(tempPath, {
          recursive: true,
          force: true,
        });
      }

      return {
        success: true,
        message: 'Дані OPORA успішно відновлено',
        safetyBackupPath,
      };
    } catch (error: unknown) {
      /*
       * Якщо ми вже почали заміну робочих даних і щось пішло
       * не так — автоматично повертаємо стан, який був
       * безпосередньо перед Restore.
       */
      if (replacementStarted && safetyBackupPath) {
        try {
          if (this.dataSource.isInitialized) {
            await this.dataSource.destroy();
          }

          const rollbackPath = join(tempPath, 'rollback');

          if (existsSync(rollbackPath)) {
            rmSync(rollbackPath, {
              recursive: true,
              force: true,
            });
          }

          mkdirSync(rollbackPath, { recursive: true });

          const safetyZip = new AdmZip(safetyBackupPath);
          safetyZip.extractAllTo(rollbackPath, true);

          const safetyDatabasePath = join(rollbackPath, 'dilovod.sqlite');

          const safetyDocumentsPath = join(rollbackPath, 'documents');

          if (!existsSync(safetyDatabasePath)) {
            throw new Error('У страховочній копії відсутня база даних');
          }

          // Повертаємо попередню БД.
          cpSync(safetyDatabasePath, databasePath);

          // Повертаємо попередні документи.
          if (existsSync(documentsPath)) {
            rmSync(documentsPath, {
              recursive: true,
              force: true,
            });
          }

          if (existsSync(safetyDocumentsPath)) {
            cpSync(safetyDocumentsPath, documentsPath, {
              recursive: true,
            });
          } else {
            mkdirSync(documentsPath, { recursive: true });
          }

          // На випадок, якщо страховочна БД теж legacy.
          prepareLegacyDatabase();

          // Повертаємо з'єднання з відновленою попередньою БД.
          await this.dataSource.initialize();
        } catch (rollbackError: unknown) {
          const rollbackMessage =
            rollbackError instanceof Error
              ? rollbackError.message
              : 'Невідома помилка';

          console.error(`Критична помилка rollback OPORA: ${rollbackMessage}`);
        }
      } else if (!this.dataSource.isInitialized) {
        /*
         * Якщо робочі файли ще не замінювалися,
         * але connection виявився закритим,
         * просто намагаємося його повернути.
         */
        try {
          await this.dataSource.initialize();
        } catch (reconnectError: unknown) {
          const reconnectMessage =
            reconnectError instanceof Error
              ? reconnectError.message
              : 'Невідома помилка';

          console.error(
            `Не вдалося повторно підключити БД OPORA: ${reconnectMessage}`,
          );
        }
      }

      // Прибираємо тимчасові файли незалежно від результату.
      if (existsSync(tempPath)) {
        rmSync(tempPath, {
          recursive: true,
          force: true,
        });
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Невідома помилка';

      throw new InternalServerErrorException(
        `Не вдалося відновити резервну копію: ${message}`,
      );
    }
  }
}
