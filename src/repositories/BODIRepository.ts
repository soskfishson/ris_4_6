import { DataSource, Repository } from 'typeorm';
import { BODI } from '../entities/BODI';
import { centralLogger, territorial1Logger, territorial2Logger } from '../config/logger';

export class BODIRepository {
  private repository: Repository<BODI>;
  private logger: any;

  constructor(dataSource: DataSource, serviceName: string) {
    this.repository = dataSource.getRepository(BODI);
    
    switch (serviceName) {
      case 'central':
        this.logger = centralLogger;
        break;
      case 'territorial1':
        this.logger = territorial1Logger;
        break;
      case 'territorial2':
        this.logger = territorial2Logger;
        break;
      default:
        this.logger = centralLogger;
    }
  }

  // async save(bodi: BODI): Promise<BODI> {
  //   try {
  //     const result = await this.repository.save(bodi);
  //     this.logger.info(`Saved BODI record: ${bodi.ist}-${bodi.obj}-${bodi.datvSet}`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error saving BODI record: ${error}`);
  //     throw error;
  //   }
  // }

  async saveMany(bodiList: BODI[]): Promise<BODI[]> {
    try {
      const result = await this.repository.save(bodiList);
      this.logger.info(`Saved ${bodiList.length} BODI records`);
      return result;
    } catch (error) {
      this.logger.error(`Error saving multiple BODI records: ${error}`);
      throw error;
    }
  }

  // async findBySourceAndTime(ist: string, datvSet: Date): Promise<BODI[]> {
  //   try {
  //     const result = await this.repository.find({
  //       where: {
  //         ist,
  //         datvSet,
  //       }
  //     });
  //     this.logger.info(`Found ${result.length} BODI records for source ${ist} and time ${datvSet}`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding BODI records: ${error}`);
  //     throw error;
  //   }
  // }

  async findBySource(ist: string): Promise<BODI[]> {
    try {
      const result = await this.repository.find({
        where: {
          ist,
        }
      });
      this.logger.info(`Found ${result.length} BODI records for source ${ist}`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding BODI records: ${error}`);
      throw error;
    }
  }

  async findByTimeRange(startTime: Date, endTime: Date): Promise<BODI[]> {
    try {
      const result = await this.repository
        .createQueryBuilder('bodi')
        .where('bodi.datv_set >= :startTime', { startTime })
        .andWhere('bodi.datv_set <= :endTime', { endTime })
        .getMany();
      
      this.logger.info(`Found ${result.length} BODI records between ${startTime} and ${endTime}`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding BODI records in time range: ${error}`);
      throw error;
    }
  }

  // async deleteOldRecords(olderThan: Date): Promise<number> {
  //   try {
  //     const result = await this.repository
  //       .createQueryBuilder()
  //       .delete()
  //       .where('datv_set < :olderThan', { olderThan })
  //       .execute();
  //
  //     this.logger.info(`Deleted ${result.affected} old BODI records older than ${olderThan}`);
  //     return result.affected || 0;
  //   } catch (error) {
  //     this.logger.error(`Error deleting old BODI records: ${error}`);
  //     throw error;
  //   }
  // }
} 