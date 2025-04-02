import { BODI } from '../entities/BODI';
import { BODK } from '../entities/BODK';
import { BODIRepository } from '../repositories/BODIRepository';
import { BODKRepository } from '../repositories/BODKRepository';
import { DataSource } from 'typeorm';
import { replicationLogger } from '../config/logger';

export class DataGeneratorService {
  private bodiRepository: BODIRepository;
  private bodkRepository: BODKRepository;
  private serviceName: string;
  private studentNumber: number;
  private logger = replicationLogger;

  constructor(
    dataSource: DataSource, 
    serviceName: string, 
    studentNumber: number = 4
  ) {
    this.bodiRepository = new BODIRepository(dataSource, serviceName);
    this.bodkRepository = new BODKRepository(dataSource, serviceName);
    this.serviceName = serviceName;
    this.studentNumber = studentNumber;
  }

  private getRandomValue(min: number, max: number): number {
    const baseValue = 4;
    const adjustedMin = min + baseValue;
    const adjustedMax = max + baseValue;
    return Math.random() * (adjustedMax - adjustedMin) + adjustedMin;
  }

  async generateData(objectsCount: number = 10): Promise<void> {
    try {
      this.logger.info(`Starting data generation for ${this.serviceName} with ${objectsCount} objects`);
      
      const sources = ['101', '102'];
      const currentTime = new Date();
      
      for (const source of sources) {
        const bodiRecords: BODI[] = [];
        
        for (let i = 1; i <= objectsCount; i++) {
          const objCode = i.toString().padStart(16, '0');
          
          const bodi = new BODI({
            ist: source,
            tabl: 'EXPOE',
            pok: '1234',
            ut: '00',
            sub: this.serviceName === 'territorial1' ? '100001' : '100002',
            otn: '00',
            obj: objCode,
            vid: '01',
            per: '01',
            datv: currentTime,
            datvSet: currentTime,
            znc: this.getRandomValue(100, 1000),
            pp: '01'
          });
          
          bodiRecords.push(bodi);
        }
        
        await this.bodiRepository.saveMany(bodiRecords);
        
        const bodk = new BODK({
          ist: source,
          sub: this.serviceName === 'territorial1' ? '100001' : '100002',
          datvSet: currentTime,
          kzap: objectsCount
        });
        
        await this.bodkRepository.save(bodk);
        
        this.logger.info(`Generated ${objectsCount} records for source ${source} in ${this.serviceName}`);
      }
      
      this.logger.info(`Data generation completed for ${this.serviceName}`);
    } catch (error) {
      this.logger.error(`Error generating data: ${error}`);
      throw error;
    }
  }
} 