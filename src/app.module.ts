import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoldiersModule } from './soldiers/soldiers.module';
import { RequisitesModule } from './requisites/requisites.module';
import { DocumentsModule } from './documents/documents.module';
import { TasksModule } from './tasks/tasks.module';
import { BackupModule } from './backup/backup.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'dilovod.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SoldiersModule,
    RequisitesModule,
    DocumentsModule,
    TasksModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
