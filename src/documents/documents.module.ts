import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Soldier } from '../soldiers/entities/soldier.entity';
import { Requisites } from '../requisites/entities/requisites.entity';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Soldier, Requisites])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
