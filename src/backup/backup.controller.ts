import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { BackupService } from './backup.service';

type UploadedBackupFile = {
  buffer: Buffer;
};

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  createBackup() {
    const backupPath = this.backupService.createBackup();

    return {
      message: 'Резервну копію успішно створено',
      path: backupPath,
    };
  }

  @Post('restore')
  @UseInterceptors(FileInterceptor('file'))
  restoreBackup(@UploadedFile() file?: UploadedBackupFile) {
    if (!file) {
      throw new BadRequestException('Файл резервної копії не передано');
    }

    return this.backupService.restoreBackup(file.buffer);
  }
}
