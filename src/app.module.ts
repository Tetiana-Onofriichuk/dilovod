import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoldiersModule } from './soldiers/soldiers.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'dilovod.sqlite',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SoldiersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
