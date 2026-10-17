import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('soldiers')
export class Soldier {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: '' })
  lastName!: string;

  @Column({ default: '' })
  lastNameGenitive!: string;

  @Column({ default: '' })
  lastNameSearch!: string;

  @Column({ default: '' })
  firstName!: string;

  @Column({ default: '' })
  patronymic!: string;

  @Column({ default: '' })
  rank!: string;

  @Column({ default: '' })
  position!: string;

  @Column({ default: '' })
  positionGenitive!: string;

  @Column({ default: '' })
  platoon!: string;

  @Column({ default: '' })
  platoonGenitive!: string;

  @Column({ default: '' })
  squad!: string;

  @Column({ default: '' })
  weapon!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: '' })
  address!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
