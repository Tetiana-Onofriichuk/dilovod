import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { DocumentsService } from './documents.service';
import { CreateVacationReportDto } from './dto/create-vacation-report.dto';
import { CreateFamilyLeaveReportDto } from './dto/create-family-leave-report.dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('vacation-report')
  async generateVacationReport(
    @Body() dto: CreateVacationReportDto,
    @Res() res: Response,
  ) {
    const file = await this.documentsService.generateVacationReport(dto);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="vacation-report.docx"',
      'Content-Length': file.length,
    });

    res.send(file);
  }
  @Post('family-leave-report')
  async generateFamilyLeaveReport(
    @Body() dto: CreateFamilyLeaveReportDto,
    @Res() res: Response,
  ) {
    const file = await this.documentsService.generateFamilyLeaveReport(dto);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="family-leave-report.docx"',
      'Content-Length': file.length,
    });

    res.send(file);
  }
}
