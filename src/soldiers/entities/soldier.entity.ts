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

  @Column()
  lastName!: string;

  @Column({ default: '' })
  lastNameGenitive!: string;

  @Column()
  firstName!: string;

  @Column({ nullable: true })
  patronymic!: string;

  @Column()
  rank!: string;

  @Column()
  position!: string;

  @Column()
  platoon!: string;

  @Column()
  squad!: string;

  @Column()
  phone!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
