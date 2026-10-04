import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Soldier } from './entities/soldier.entity';
import { CreateSoldierDto } from './dto/create-soldier.dto';
import { UpdateSoldierDto } from './dto/update-soldier.dto';

@Injectable()
export class SoldiersService {
  constructor(
    @InjectRepository(Soldier)
    private readonly soldiersRepository: Repository<Soldier>,
  ) {}

  create(createSoldierDto: CreateSoldierDto) {
    const soldier = this.soldiersRepository.create(createSoldierDto);

    return this.soldiersRepository.save(soldier);
  }

  async findAll(search?: string, page = 1, limit = 20) {
    const [soldiers, total] = await this.soldiersRepository.findAndCount({
      where: search
        ? {
            lastName: ILike(`%${search}%`),
          }
        : {},
      skip: (page - 1) * limit,
      take: limit,
      order: {
        lastName: 'ASC',
      },
    });

    return {
      soldiers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const soldier = await this.soldiersRepository.findOne({
      where: { id },
    });

    if (!soldier) {
      throw new NotFoundException(`Soldier with ID ${id} not found`);
    }

    return soldier;
  }
  async update(id: number, updateSoldierDto: UpdateSoldierDto) {
    await this.soldiersRepository.update(id, updateSoldierDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const soldier = await this.findOne(id);

    await this.soldiersRepository.remove(soldier);

    return soldier;
  }
}
