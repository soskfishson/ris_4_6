import { DataSource, Repository } from 'typeorm';
import { BODK } from '../entities/BODK';
import { centralLogger, territorial1Logger, territorial2Logger } from '../config/logger';

export class BODKRepository {
  private repository: Repository<BODK>;
  private logger: any;

  constructor(dataSource: DataSource, serviceName: string) {
    this.repository = dataSource.getRepository(BODK);
    
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

  async save(bodk: BODK): Promise<BODK> {
    try {
      const result = await this.repository.save(bodk);
      this.logger.info(`Saved BODK record: ${bodk.ist}-${bodk.sub}-${bodk.datvSet}`);
      return result;
    } catch (error) {
      this.logger.error(`Error saving BODK record: ${error}`);
      throw error;
    }
  }
  
  async findBySourceAndTime(ist: string, datvSet: Date): Promise<BODK | null> {
    try {
      const result = await this.repository.findOne({
        where: {
          ist,
          datvSet,
        }
      });
      if (result) {
        this.logger.info(`Found BODK record for source ${ist} and time ${datvSet}`);
      } else {
        this.logger.info(`No BODK record found for source ${ist} and time ${datvSet}`);
      }
      return result;
    } catch (error) {
      this.logger.error(`Error finding BODK record: ${error}`);
      throw error;
    }
  }

  // async findBySource(ist: string): Promise<BODK[]> {
  //   try {
  //     const result = await this.repository.find({
  //       where: {
  //         ist,
  //       }
  //     });
  //     this.logger.info(`Found ${result.length} BODK records for source ${ist}`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding BODK records: ${error}`);
  //     throw error;
  //   }
  // }
  //
  // async deleteOldRecords(olderThan: Date): Promise<number> {
  //   try {
  //     const result = await this.repository
  //       .createQueryBuilder()
  //       .delete()
  //       .where('datv_set < :olderThan', { olderThan })
  //       .execute();
  //
  //     this.logger.info(`Deleted ${result.affected} old BODK records older than ${olderThan}`);
  //     return result.affected || 0;
  //   } catch (error) {
  //     this.logger.error(`Error deleting old BODK records: ${error}`);
  //     throw error;
  //   }
  // }
  
  async findLatestBySource(ist: string): Promise<BODK | null> {
    try {
      const result = await this.repository.findOne({
        where: { ist },
        order: { datvSet: 'DESC' }
      });
      
      if (result) {
        this.logger.info(`Found latest BODK record for source ${ist}: ${result.datvSet}`);
      } else {
        this.logger.info(`No BODK records found for source ${ist}`);
      }
      
      return result;
    } catch (error) {
      this.logger.error(`Error finding latest BODK record: ${error}`);
      throw error;
    }
  }
} 