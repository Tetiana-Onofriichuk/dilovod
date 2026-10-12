import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

import { Soldier } from '../soldiers/entities/soldier.entity';
import { Requisites } from '../requisites/entities/requisites.entity';
import { Document } from './entities/document.entity';
import { CreateVacationReportDto } from './dto/create-vacation-report.dto';
import { CreateFamilyLeaveReportDto } from './dto/create-family-leave-report.dto';
import { CreateBankDetailsReportDto } from './dto/create-bank-details-report.dto';
import { CreateTrainingWithWeaponReportDto } from './dto/create-training-with-weapon-report.dto';
import { CreateTrainingWithoutWeaponReportDto } from './dto/create-training-without-weapon-report.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Soldier)
    private readonly soldiersRepository: Repository<Soldier>,

    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async generateVacationReport(dto: CreateVacationReportDto): Promise<Buffer> {
    const soldier = await this.soldiersRepository.findOne({
      where: { id: dto.soldierId },
    });

    if (!soldier) {
      throw new NotFoundException('Військовослужбовця не знайдено');
    }

    const requisites = await this.requisitesRepository.findOne({
      where: {},
    });

    if (!requisites) {
      throw new NotFoundException('Реквізити не знайдено');
    }

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'vacation-report-template.docx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException('Шаблон рапорту не знайдено');
    }

    const template = fs.readFileSync(templatePath);

    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}',
      },
    });

    const fullName = `${soldier.lastName} ${soldier.firstName} ${soldier.patronymic}`;

    const lastNameUpper = soldier.lastName.toUpperCase();

    const initials = `${soldier.firstName.charAt(0)}.${soldier.patronymic.charAt(0)}.`;

    const reportYear = new Date(`${dto.reportDate}T00:00:00`).getFullYear();

    const positionCapitalized =
      soldier.position.charAt(0).toUpperCase() + soldier.position.slice(1);

    doc.render({
      days: dto.days,
      daysWords: this.numberToUkrainianWords(dto.days),

      travelDays: dto.travelDays,
      travelDaysWords: this.numberToUkrainianWords(dto.travelDays),

      startDate: this.formatDate(dto.startDate),

      transport: dto.transport,
      address: dto.address,

      phone: soldier.phone,

      lastName: soldier.lastName,
      lastNameUpper,

      firstName: soldier.firstName,
      patronymic: soldier.patronymic,
      fullName,
      initials,

      rank: soldier.rank,
      position: positionCapitalized,
      platoon: soldier.platoon,
      squad: soldier.squad,

      reportDate: this.formatDate(dto.reportDate),
      reportYear,

      rankGenitive: this.getRankGenitive(soldier.rank),
      lastNameGenitive: soldier.lastNameGenitive,

      companyCommanderPosition: requisites.companyCommanderPosition,
      companyCommanderRank: requisites.companyCommanderRank,
      companyCommanderFirstName: requisites.companyCommanderFirstName,
      companyCommanderLastName:
        requisites.companyCommanderLastName.toUpperCase(),

      unitCommanderPosition: requisites.unitCommanderPosition,
      unitCommanderRank: requisites.unitCommanderRank,
      unitCommanderFirstName: requisites.unitCommanderFirstName,
      unitCommanderLastName: requisites.unitCommanderLastName.toUpperCase(),
    });

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    await this.saveDocument(buffer, 'Рапорт на відпустку', 'vacation', [
      soldier,
    ]);

    return buffer;
  }

  async generateFamilyLeaveReport(
    dto: CreateFamilyLeaveReportDto,
  ): Promise<Buffer> {
    const soldier = await this.soldiersRepository.findOne({
      where: { id: dto.soldierId },
    });

    if (!soldier) {
      throw new NotFoundException('Військовослужбовця не знайдено');
    }

    const requisites = await this.requisitesRepository.findOne({
      where: {},
    });

    if (!requisites) {
      throw new NotFoundException('Реквізити не знайдено');
    }

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'family-leave-report-template.docx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException('Шаблон сімейного рапорту не знайдено');
    }

    const template = fs.readFileSync(templatePath);
    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}',
      },
    });

    const fullName = `${soldier.lastName} ${soldier.firstName} ${soldier.patronymic}`;

    const lastNameUpper = soldier.lastName.toUpperCase();

    const initials = `${soldier.firstName.charAt(0)}.${soldier.patronymic.charAt(0)}.`;

    const reportYear = new Date(`${dto.reportDate}T00:00:00`).getFullYear();

    doc.render({
      leaveReason: dto.leaveReason,

      days: dto.days,
      daysWords: this.numberToUkrainianWords(dto.days),

      startDate: this.formatDate(dto.startDate),

      address: dto.address,
      attachment: dto.attachment,

      phone: soldier.phone,

      lastName: soldier.lastName,
      lastNameUpper,

      firstName: soldier.firstName,
      patronymic: soldier.patronymic,
      fullName,
      initials,

      rank: soldier.rank,
      position: soldier.position,
      platoon: soldier.platoon,
      squad: soldier.squad,

      rankGenitive: this.getRankGenitive(soldier.rank),
      lastNameGenitive: soldier.lastNameGenitive,

      reportDate: this.formatDate(dto.reportDate),
      reportYear,

      companyCommanderPosition: requisites.companyCommanderPosition,
      companyCommanderRank: requisites.companyCommanderRank,
      companyCommanderFirstName: requisites.companyCommanderFirstName,
      companyCommanderLastName:
        requisites.companyCommanderLastName.toUpperCase(),

      unitCommanderPosition: requisites.unitCommanderPosition,
      unitCommanderRank: requisites.unitCommanderRank,
      unitCommanderFirstName: requisites.unitCommanderFirstName,
      unitCommanderLastName: requisites.unitCommanderLastName.toUpperCase(),
    });

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    await this.saveDocument(
      buffer,
      'Рапорт на відпустку за сімейними обставинами',
      'family-leave',
      [soldier],
    );

    return buffer;
  }
  async generateBankDetailsReport(
    dto: CreateBankDetailsReportDto,
  ): Promise<Buffer> {
    const soldier = await this.soldiersRepository.findOne({
      where: { id: dto.soldierId },
    });

    if (!soldier) {
      throw new NotFoundException('Військовослужбовця не знайдено');
    }

    const requisites = await this.requisitesRepository.findOne({
      where: {},
    });

    if (!requisites) {
      throw new NotFoundException('Реквізити не знайдено');
    }

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'bank-details-report-template.docx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(
        'Шаблон рапорту про банківські реквізити не знайдено',
      );
    }

    const template = fs.readFileSync(templatePath);

    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}',
      },
    });

    const positionCapitalized =
      soldier.position.charAt(0).toUpperCase() + soldier.position.slice(1);

    doc.render({
      bankAccount: dto.bankAccount,
      bankName: dto.bankName,
      reportDate: this.formatDate(dto.reportDate),

      position: positionCapitalized,
      rank: soldier.rank,
      firstName: soldier.firstName,
      lastName: soldier.lastName.toUpperCase(),

      financeChiefPosition: requisites.financeChiefPosition,
    });

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    await this.saveDocument(
      buffer,
      'Рапорт про банківські реквізити',
      'bank-details',
      [soldier],
    );

    return buffer;
  }

  async generateTrainingWithWeaponReport(
    dto: CreateTrainingWithWeaponReportDto,
  ): Promise<Buffer> {
    const soldiers = await this.soldiersRepository.find({
      where: {
        id: In(dto.soldierIds),
      },
    });

    if (soldiers.length !== dto.soldierIds.length) {
      throw new NotFoundException(
        'Одного або декількох військовослужбовців не знайдено',
      );
    }

    const orderedSoldiers = dto.soldierIds.map((id) => {
      const soldier = soldiers.find((item) => item.id === id);

      if (!soldier) {
        throw new NotFoundException('Військовослужбовця не знайдено');
      }

      return soldier;
    });

    const soldierWithoutWeapon = orderedSoldiers.find(
      (soldier) => !soldier.weapon?.trim(),
    );

    if (soldierWithoutWeapon) {
      throw new NotFoundException(
        'У одного або декількох військовослужбовців не вказана зброя',
      );
    }

    const requisites = await this.requisitesRepository.findOne({
      where: {},
    });

    if (!requisites) {
      throw new NotFoundException('Реквізити не знайдено');
    }

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'training-with-weapon-report-template.docx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(
        'Шаблон рапорту на навчання зі зброєю не знайдено',
      );
    }

    const template = fs.readFileSync(templatePath);
    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}',
      },
    });

    const startDate = new Date(`${dto.startDate}T00:00:00`);
    const endDate = new Date(`${dto.endDate}T00:00:00`);

    const days =
      Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      ) + 1;

    const dryRationText = dto.includeDryRation
      ? 'Прошу видати повсякденний набір сухих продуктів на 1 (одну) добу, в кількості 1(одна) штука.'
      : '';

    const reportYear = new Date(`${dto.reportDate}T00:00:00`).getFullYear();

    const soldiersList = orderedSoldiers
      .map((soldier, index) => {
        let fullNameGenitive: string;

        if (index === 0) {
          fullNameGenitive = dto.soldierFullNameGenitive;
        } else {
          const additionalSoldier = dto.additionalSoldiersGenitive.find(
            (item) => item.soldierId === soldier.id,
          );

          fullNameGenitive =
            additionalSoldier?.fullNameGenitive ??
            `${soldier.lastNameGenitive ?? soldier.lastName} ${soldier.firstName} ${soldier.patronymic}`;
        }

        return `${this.getRankGenitive(
          soldier.rank,
        )} ${fullNameGenitive}, ${soldier.positionGenitive || soldier.position}, із закріпленою за ним зброєю ${soldier.weapon}`;
      })
      .join(';\n\t');

    doc.render({
      startDate: this.formatDate(dto.startDate),
      endDate: this.formatDate(dto.endDate),
      days,
      destination: dto.destination,
      soldierFullNameGenitive: dto.soldierFullNameGenitive,
      position: orderedSoldiers[0].position,
      rankGenitive: this.getRankGenitive(orderedSoldiers[0].rank),
      weapon: orderedSoldiers[0].weapon,
      soldiersList,

      trainingPurpose: dto.trainingPurpose,
      basis: dto.basis,

      dryRationText,

      reportDate: this.formatDate(dto.reportDate),
      reportYear,

      companyCommanderPosition: requisites.companyCommanderPosition,
      companyCommanderRank: requisites.companyCommanderRank,
      companyCommanderFirstName: requisites.companyCommanderFirstName,
      companyCommanderLastName:
        requisites.companyCommanderLastName.toUpperCase(),

      unitCommanderPosition: requisites.unitCommanderPosition,
      unitCommanderRank: requisites.unitCommanderRank,
      unitCommanderFirstName: requisites.unitCommanderFirstName,
      unitCommanderLastName: requisites.unitCommanderLastName.toUpperCase(),

      companyCommanderRankGenitive: this.getRankGenitive(
        requisites.companyCommanderRank,
      ),

      companyCommanderLastNameGenitive:
        requisites.companyCommanderLastNameGenitive,

      companyCommanderFirstNameInitial:
        requisites.companyCommanderFirstName.charAt(0),

      companyCommanderPatronymicInitial:
        requisites.companyCommanderPatronymic.charAt(0),
    });

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    await this.saveDocument(
      buffer,
      'Рапорт на навчання зі зброєю',
      'training-with-weapon',
      soldiers,
    );

    return buffer;
  }
  async generateTrainingWithoutWeaponReport(
    dto: CreateTrainingWithoutWeaponReportDto,
  ): Promise<Buffer> {
    const soldiers = await this.soldiersRepository.find({
      where: {
        id: In(dto.soldierIds),
      },
    });

    if (soldiers.length !== dto.soldierIds.length) {
      throw new NotFoundException(
        'Одного або декількох військовослужбовців не знайдено',
      );
    }
    const orderedSoldiers = dto.soldierIds.map((id) => {
      const soldier = soldiers.find((item) => item.id === id);

      if (!soldier) {
        throw new NotFoundException('Військовослужбовця не знайдено');
      }

      return soldier;
    });

    const requisites = await this.requisitesRepository.findOne({
      where: {},
    });

    if (!requisites) {
      throw new NotFoundException('Реквізити не знайдено');
    }

    const templatePath = path.join(
      process.cwd(),
      'templates',
      'training-without-weapon-report-template.docx',
    );

    if (!fs.existsSync(templatePath)) {
      throw new NotFoundException(
        'Шаблон рапорту на навчання без зброї не знайдено',
      );
    }

    const template = fs.readFileSync(templatePath);
    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      delimiters: {
        start: '{{',
        end: '}}',
      },
    });

    const reportYear = new Date(`${dto.reportDate}T00:00:00`).getFullYear();

    const dryRationText = dto.includeDryRation
      ? 'Прошу видати повсякденний набір сухих продуктів на 1 (одну) добу, в кількості 1(одна) штука.'
      : '';

    const soldiersList = orderedSoldiers
      .map((soldier, index) => {
        let fullNameGenitive: string;

        if (index === 0) {
          fullNameGenitive = dto.soldierFullNameGenitive;
        } else {
          const additionalSoldier = dto.additionalSoldiersGenitive.find(
            (item) => item.soldierId === soldier.id,
          );

          fullNameGenitive =
            additionalSoldier?.fullNameGenitive ??
            `${soldier.lastNameGenitive ?? soldier.lastName} ${soldier.firstName} ${soldier.patronymic}`;
        }

        return `${this.getRankGenitive(
          soldier.rank,
        )} ${fullNameGenitive}, ${soldier.positionGenitive || soldier.position}`;
      })
      .join(';\n\t');

    doc.render({
      startDate: this.formatDate(dto.startDate),
      endDate: this.formatDate(dto.endDate),

      destination: dto.destination,

      soldierFullNameGenitive: dto.soldierFullNameGenitive,
      position: orderedSoldiers[0].position,
      rankGenitive: this.getRankGenitive(orderedSoldiers[0].rank),

      soldiersList,

      trainingPurpose: dto.trainingPurpose,
      basis: dto.basis,
      dryRationText,

      reportDate: this.formatDate(dto.reportDate),
      reportYear,

      companyCommanderPosition: requisites.companyCommanderPosition,
      companyCommanderRank: requisites.companyCommanderRank,
      companyCommanderFirstName: requisites.companyCommanderFirstName,
      companyCommanderPatronymic: requisites.companyCommanderPatronymic,
      companyCommanderLastName:
        requisites.companyCommanderLastName.toUpperCase(),

      companyCommanderRankGenitive: this.getRankGenitive(
        requisites.companyCommanderRank,
      ),
      companyCommanderLastNameGenitive:
        requisites.companyCommanderLastNameGenitive,
      companyCommanderFirstNameInitial:
        requisites.companyCommanderFirstName.charAt(0),
      companyCommanderPatronymicInitial:
        requisites.companyCommanderPatronymic.charAt(0),

      unitCommanderPosition: requisites.unitCommanderPosition,
      unitCommanderRank: requisites.unitCommanderRank,
      unitCommanderFirstName: requisites.unitCommanderFirstName,
      unitCommanderLastName: requisites.unitCommanderLastName.toUpperCase(),
    });

    const buffer = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    await this.saveDocument(
      buffer,
      'Рапорт на навчання без зброї',
      'training-without-weapon',
      soldiers,
    );

    return buffer;
  }
  async getDocuments() {
    const documents = await this.documentsRepository.find({
      relations: {
        soldiers: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return documents.map((document) => ({
      id: document.id,
      title: document.title,
      type: document.type,
      soldiers: document.soldiers.map((soldier) => ({
        id: soldier.id,
        lastName: soldier.lastName,
        firstName: soldier.firstName,
        patronymic: soldier.patronymic,
      })),
      fileName: document.fileName,
      createdAt: document.createdAt,
    }));
  }

  async getDocumentsBySoldier(soldierId: number) {
    const soldier = await this.soldiersRepository.findOne({
      where: { id: soldierId },
    });

    if (!soldier) {
      throw new NotFoundException('Військовослужбовця не знайдено');
    }

    const documents = await this.documentsRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.soldiers', 'soldier')
      .where('soldier.id = :soldierId', { soldierId })
      .orderBy('document.createdAt', 'DESC')
      .getMany();

    return documents.map((document) => ({
      id: document.id,
      title: document.title,
      type: document.type,
      soldiers: document.soldiers.map((soldier) => ({
        id: soldier.id,
        lastName: soldier.lastName,
        firstName: soldier.firstName,
        patronymic: soldier.patronymic,
      })),
      fileName: document.fileName,
      createdAt: document.createdAt,
    }));
  }
  async getDocumentFile(id: number): Promise<{
    buffer: Buffer;
    fileName: string;
  }> {
    const document = await this.documentsRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Документ не знайдено');
    }

    if (!fs.existsSync(document.filePath)) {
      throw new NotFoundException('Файл документа не знайдено');
    }

    const buffer = fs.readFileSync(document.filePath);

    return {
      buffer,
      fileName: document.fileName,
    };
  }

  async deleteDocument(id: number): Promise<void> {
    const document = await this.documentsRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException('Документ не знайдено');
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await this.documentsRepository.remove(document);
  }
  private async saveDocument(
    buffer: Buffer,
    title: string,
    type: string,
    soldiers: Soldier[],
  ): Promise<void> {
    const documentsDirectory = path.join(process.cwd(), 'documents');

    if (!fs.existsSync(documentsDirectory)) {
      fs.mkdirSync(documentsDirectory, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${type}-${timestamp}.docx`;
    const filePath = path.join(documentsDirectory, fileName);

    fs.writeFileSync(filePath, buffer);

    const document = this.documentsRepository.create({
      title,
      type,
      soldiers,
      fileName,
      filePath,
    });

    await this.documentsRepository.save(document);
  }

  private formatDate(date: string): string {
    if (!date) {
      return '';
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString('uk-UA');
  }

  private numberToUkrainianWords(value: string): string {
    const numbers: Record<number, string> = {
      0: 'нуль',
      1: 'одна',
      2: 'дві',
      3: 'три',
      4: 'чотири',
      5: "п'ять",
      6: 'шість',
      7: 'сім',
      8: 'вісім',
      9: "дев'ять",
      10: 'десять',
      11: 'одинадцять',
      12: 'дванадцять',
      13: 'тринадцять',
      14: 'чотирнадцять',
      15: "п'ятнадцять",
      16: 'шістнадцять',
      17: 'сімнадцять',
      18: 'вісімнадцять',
      19: "дев'ятнадцять",
      20: 'двадцять',
      21: 'двадцять одна',
      22: 'двадцять дві',
      23: 'двадцять три',
      24: 'двадцять чотири',
      25: "двадцять п'ять",
      26: 'двадцять шість',
      27: 'двадцять сім',
      28: 'двадцять вісім',
      29: "двадцять дев'ять",
      30: 'тридцять',
    };

    return numbers[Number(value)] ?? value;
  }

  private getRankGenitive(rank: string): string {
    const ranks: Record<string, string> = {
      рекрут: 'рекрута',
      солдат: 'солдата',
      'старший солдат': 'старшого солдата',

      'молодший сержант': 'молодшого сержанта',
      сержант: 'сержанта',
      'старший сержант': 'старшого сержанта',
      'головний сержант': 'головного сержанта',
      'штаб-сержант': 'штаб-сержанта',

      'майстер-сержант': 'майстер-сержанта',
      'старший майстер-сержант': 'старшого майстер-сержанта',
      'головний майстер-сержант': 'головного майстер-сержанта',

      'молодший лейтенант': 'молодшого лейтенанта',
      лейтенант: 'лейтенанта',
      'старший лейтенант': 'старшого лейтенанта',
      капітан: 'капітана',
      майор: 'майора',
      підполковник: 'підполковника',
      полковник: 'полковника',
    };

    const normalizedRank = rank.trim().toLowerCase();

    return ranks[normalizedRank] ?? rank;
  }
}
