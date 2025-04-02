import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('t_ist')
export class T_IST {
  @PrimaryColumn({ length: 3, name: 'ist' })
  ist: string; // Source code

  @Column({ length: 3, name: 'period' })
  period: string; // Exchange period

  @Column({ length: 1, name: 'ed' })
  ed: string; // Exchange unit (m - minutes, d - days, h - hours, N - asynchronous)

  @Column({ length: 2, name: 'dt_beg' })
  dtBeg: string; // Start delay

  @Column({ length: 2, name: 'dt_end' })
  dtEnd: string; // End delay

  constructor(partial: Partial<T_IST> = {}) {
    Object.assign(this, partial);
  }
} 