import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('bodk')
export class BODK {
  @PrimaryColumn({ length: 3, name: 'ist' })
  ist: string; // Source code

  @PrimaryColumn({ length: 6, name: 'sub' })
  sub: string; // Subject code

  @PrimaryColumn({ type: 'timestamp', name: 'datv_set' })
  datvSet: Date; // Time stamp of records in BODI

  @Column({ type: 'smallint', name: 'kzap' })
  kzap: number; // Number of records in BODI for this time interval

  constructor(partial: Partial<BODK> = {}) {
    Object.assign(this, partial);
  }
} 