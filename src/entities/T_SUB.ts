import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('t_sub')
export class T_SUB {
  @Column({ length: 1, name: 'act' })
  act: string; // Activity flag

  @PrimaryColumn({ length: 6, name: 'sub' })
  sub: string; // Subject code

  @Column({ length: 50, name: 'sub_name' })
  subName: string; // Subject name

  @Column({ length: 1, name: 'with_proxy', nullable: true })
  withProxy?: string; // Work through proxy flag

  @Column({ length: 50, name: 'sub_adr' })
  subAdr: string; // IP address or site name

  @Column({ length: 5, name: 'sub_port' })
  subPort: string; // Port

  @Column({ length: 60, name: 'sub_proxy', nullable: true })
  subProxy?: string; // Proxy address

  @Column({ length: 255, name: 'sub_path' })
  subPath: string; // Path to document

  @Column({ length: 5, name: 'sub_proxy_port', nullable: true })
  subProxyPort?: string; // Proxy port

  constructor(partial: Partial<T_SUB> = {}) {
    Object.assign(this, partial);
  }
} 