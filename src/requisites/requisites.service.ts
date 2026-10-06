import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Requisites } from './entities/requisites.entity';
import { UpdateRequisitesDto } from './dto/update-requisites.dto';

@Injectable()
export class RequisitesService {
  constructor(
    @InjectRepository(Requisites)
    private readonly requisitesRepository: Repository<Requisites>,
  ) {}

  async getRequisites(): Promise<Requisites> {
    let requisites = await this.requisitesRepository.findOne({
      where: {},
    });

    if (!requisites) {
      requisites = this.requisitesRepository.create();
      requisites = await this.requisitesRepository.save(requisites);
    }

    return requisites;
  }

  async updateRequisites(
    updateRequisitesDto: UpdateRequisitesDto,
  ): Promise<Requisites> {
    const requisites = await this.getRequisites();

    Object.assign(requisites, updateRequisitesDto);

    return this.requisitesRepository.save(requisites);
  }
}
