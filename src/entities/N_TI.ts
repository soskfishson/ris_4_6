import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('n_ti')
export class N_TI {
  @PrimaryColumn({ length: 3, name: 'ist' })
  ist: string; // Source code

  @PrimaryColumn({ length: 5, name: 'tabl' })
  tabl: string; // Table name in GO database

  @PrimaryColumn({ length: 4, name: 'pok' })
  pok: string; // Indicator code

  @PrimaryColumn({ length: 2, name: 'ut' })
  ut: string; // Clarification code

  @PrimaryColumn({ length: 6, name: 'sub' })
  sub: string; // Subject code

  @PrimaryColumn({ length: 2, name: 'otn' })
  otn: string; // Relation code

  @PrimaryColumn({ length: 16, name: 'obj' })
  obj: string; // Object code

  @PrimaryColumn({ length: 2, name: 'vid' })
  vid: string; // Information type code

  @PrimaryColumn({ length: 2, name: 'per' })
  per: string; // Period code

  @Column({ type: 'integer', name: 'n_ti' })
  n_ti: number; // TI number

  @Column({ length: 6, name: 'sub_r' })
  subR: string; // Recipient code

  @Column({ length: 50, name: 'name', nullable: true })
  name?: string; // Object name

  @Column({ type: 'smallint', name: 'act' })
  act: number; // Actuality

  constructor(partial: Partial<N_TI> = {}) {
    Object.assign(this, partial);
  }
} 