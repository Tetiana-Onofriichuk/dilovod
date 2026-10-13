import { Injectable } from '@nestjs/common';
import { join } from 'path';

import { getOporaRootPath } from './storage-paths';

@Injectable()
export class StorageService {
  getRootPath(): string {
    return getOporaRootPath();
  }

  getDatabasePath(): string {
    return join(this.getRootPath(), 'dilovod.sqlite');
  }

  getDocumentsPath(): string {
    return join(this.getRootPath(), 'documents');
  }

  getBackupsPath(): string {
    return join(this.getRootPath(), 'backups');
  }

  getBackupTempPath(): string {
    return join(this.getRootPath(), 'backup-temp');
  }

  getTemplatesPath(): string {
    return join(process.cwd(), 'templates');
  }
}
