import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Soldier } from '../../soldiers/entities/soldier.entity';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  type!: string;

  @ManyToMany(() => Soldier)
  @JoinTable({
    name: 'document_soldiers',
    joinColumn: {
      name: 'documentId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'soldierId',
      referencedColumnName: 'id',
    },
  })
  soldiers!: Soldier[];

  @Column()
  fileName!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
