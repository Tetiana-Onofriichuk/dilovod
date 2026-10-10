import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { DocumentsService } from './documents.service';
import { CreateVacationReportDto } from './dto/create-vacation-report.dto';
import { CreateFamilyLeaveReportDto } from './dto/create-family-leave-report.dto';
import { CreateBankDetailsReportDto } from './dto/create-bank-details-report.dto';
import { CreateTrainingWithWeaponReportDto } from './dto/create-training-with-weapon-report.dto';
import { CreateTrainingWithoutWeaponReportDto } from './dto/create-training-without-weapon-report.dto';

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

  @Post('bank-details-report')
  async generateBankDetailsReport(
    @Body() dto: CreateBankDetailsReportDto,
    @Res() res: Response,
  ) {
    const file = await this.documentsService.generateBankDetailsReport(dto);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="bank-details-report.docx"',
      'Content-Length': file.length,
    });

    res.send(file);
  }
  @Post('training-with-weapon-report')
  async generateTrainingWithWeaponReport(
    @Body() dto: CreateTrainingWithWeaponReportDto,
    @Res() res: Response,
  ) {
    const file =
      await this.documentsService.generateTrainingWithWeaponReport(dto);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition':
        'attachment; filename="training-with-weapon-report.docx"',
      'Content-Length': file.length,
    });

    res.send(file);
  }
  @Post('training-without-weapon-report')
  async generateTrainingWithoutWeaponReport(
    @Body() dto: CreateTrainingWithoutWeaponReportDto,
    @Res() res: Response,
  ) {
    const file =
      await this.documentsService.generateTrainingWithoutWeaponReport(dto);

    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition':
        'attachment; filename="training-without-weapon-report.docx"',
      'Content-Length': file.length,
    });

    res.send(file);
  }
}
