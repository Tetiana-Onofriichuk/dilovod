import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoldiersModule } from './soldiers/soldiers.module';
import { RequisitesModule } from './requisites/requisites.module';
import { DocumentsModule } from './documents/documents.module';
import { TasksModule } from './tasks/tasks.module';
import { BackupModule } from './backup/backup.module';
import { StorageModule } from './storage/storage.module';
import { getDatabasePath } from './storage/storage-paths';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: getDatabasePath(),
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      migrations: ['dist/database/migrations/*.js'],
      migrationsRun: process.env.NODE_ENV === 'production',
    }),
    SoldiersModule,
    RequisitesModule,
    DocumentsModule,
    TasksModule,
    BackupModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
