import { Entity, Column, PrimaryColumn, Index } from 'typeorm';

@Entity('bodi')
export class BODI {
  @PrimaryColumn({ length: 3, name: 'ist' })
  ist: string; // Source code

  @PrimaryColumn({ length: 5, name: 'tabl' })
  tabl: string; // Table code in GO DB

  @PrimaryColumn({ length: 4, name: 'pok' })
  pok: string; // Indicator code

  @PrimaryColumn({ length: 2, name: 'ut' })
  ut: string; // Clarification code

  @Column({ length: 6, name: 'sub' })
  @PrimaryColumn()
  sub: string; // Subject code

  @PrimaryColumn({ length: 2, name: 'otn' })
  otn: string; // Relation code

  @PrimaryColumn({ length: 16, name: 'obj' })
  obj: string; // Object code

  @PrimaryColumn({ length: 2, name: 'vid' })
  vid: string; // Type of information code

  @PrimaryColumn({ length: 2, name: 'per' })
  per: string; // Period code

  @PrimaryColumn({ type: 'timestamp', name: 'datv' })
  datv: Date; // Timestamp of the indicator

  @PrimaryColumn({ type: 'timestamp', name: 'datv_set' })
  datvSet: Date; // Timestamp of when the value was set

  @Column({ type: 'float', name: 'znc' })
  znc: number; // Indicator value

  @Column({ length: 2, name: 'pp', nullable: true })
  pp: string; // Indicator attributes (reliability, etc.)

  constructor(partial: Partial<BODI> = {}) {
    Object.assign(this, partial);
  }
} 