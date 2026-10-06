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
  companyCommanderLastName!: string;

  // Командир військової частини
  @Column({ default: '' })
  unitCommanderPosition!: string;

  @Column({ default: '' })
  unitCommanderRank!: string;

  @Column({ default: '' })
  unitCommanderFirstName!: string;

  @Column({ default: '' })
  unitCommanderLastName!: string;
}
