import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Requisites } from './entities/requisites.entity';
import { RequisitesController } from './requisites.controller';
import { RequisitesService } from './requisites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Requisites])],
  controllers: [RequisitesController],
  providers: [RequisitesService],
})
export class RequisitesModule {}
