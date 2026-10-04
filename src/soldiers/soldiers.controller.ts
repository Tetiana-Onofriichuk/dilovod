import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { SoldiersService } from './soldiers.service';
import { CreateSoldierDto } from './dto/create-soldier.dto';
import { UpdateSoldierDto } from './dto/update-soldier.dto';
import { GetSoldiersQueryDto } from './dto/get-soldiers-query.dto';

@Controller('soldiers')
export class SoldiersController {
  constructor(private readonly soldiersService: SoldiersService) {}

  @Post()
  create(@Body() createSoldierDto: CreateSoldierDto) {
    return this.soldiersService.create(createSoldierDto);
  }

  @Get()
  findAll(@Query() query: GetSoldiersQueryDto) {
    return this.soldiersService.findAll(query.search, query.page, query.limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.soldiersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSoldierDto: UpdateSoldierDto,
  ) {
    return this.soldiersService.update(id, updateSoldierDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.soldiersService.remove(id);
  }
}
