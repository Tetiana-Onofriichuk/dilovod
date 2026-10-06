import { Body, Controller, Get, Put } from '@nestjs/common';

import { RequisitesService } from './requisites.service';
import { UpdateRequisitesDto } from './dto/update-requisites.dto';

@Controller('requisites')
export class RequisitesController {
  constructor(private readonly requisitesService: RequisitesService) {}

  @Get()
  getRequisites() {
    return this.requisitesService.getRequisites();
  }

  @Put()
  updateRequisites(@Body() updateRequisitesDto: UpdateRequisitesDto) {
    return this.requisitesService.updateRequisites(updateRequisitesDto);
  }
}
