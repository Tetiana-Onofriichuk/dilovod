import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('requisites')
export class Requisites {
  @PrimaryGeneratedColumn()
  id!: number;

  // Командир роти
  @Column({ default: '' })
  companyCommanderPosition!: string;

  @Column({ default: '' })
  companyCommanderRank!: string;

  @Column({ default: '' })
  companyCommanderFirstName!: string;

  @Column({ default: '' })
  companyCommanderPatronymic!: string;

  @Column({ default: '' })
  companyCommanderLastName!: string;

  @Column({ default: '' })
  companyCommanderLastNameGenitive!: string;

  // Командир військової частини
  @Column({ default: '' })
  unitCommanderPosition!: string;

  @Column({ default: '' })
  unitCommanderRank!: string;

  @Column({ default: '' })
  unitCommanderFirstName!: string;

  @Column({ default: '' })
  unitCommanderLastName!: string;

  // Начальник фінансово-економічної служби
  @Column({ default: '' })
  financeChiefPosition!: string;

  @Column({ default: '' })
  financeChiefRank!: string;

  @Column({ default: '' })
  financeChiefFirstName!: string;

  @Column({ default: '' })
  financeChiefLastName!: string;
}
