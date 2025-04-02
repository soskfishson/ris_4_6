import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('t_s_n')
export class T_S_N {
  @PrimaryColumn({ length: 3, name: 'ist' })
  ist: string; // Source code

  @PrimaryColumn({ length: 6, name: 'sub' })
  sub: string; // Subject code

  @Column({ length: 1, name: 's_n' })
  sn: string; // Serial number

  constructor(partial: Partial<T_S_N> = {}) {
    Object.assign(this, partial);
  }
} 