import { DataSource, Repository } from 'typeorm';
import { N_TI } from '../entities/N_TI';
import { T_IST } from '../entities/T_IST';
import { T_SUB } from '../entities/T_SUB';
import { T_S_N } from '../entities/T_S_N';
import { centralLogger } from '../config/logger';

export class NTIRepository {
  private ntiRepository: Repository<N_TI>;
  private istRepository: Repository<T_IST>;
  private subRepository: Repository<T_SUB>;
  private snRepository: Repository<T_S_N>;
  private logger = centralLogger;

  constructor(dataSource: DataSource) {
    this.ntiRepository = dataSource.getRepository(N_TI);
    this.istRepository = dataSource.getRepository(T_IST);
    this.subRepository = dataSource.getRepository(T_SUB);
    this.snRepository = dataSource.getRepository(T_S_N);
  }

  // async findAllNTI(): Promise<N_TI[]> {
  //   try {
  //     const result = await this.ntiRepository.find();
  //     this.logger.info(`Found ${result.length} N_TI records`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding N_TI records: ${error}`);
  //     throw error;
  //   }
  // }
  //
  // async findNTIBySource(ist: string): Promise<N_TI[]> {
  //   try {
  //     const result = await this.ntiRepository.find({
  //       where: { ist }
  //     });
  //     this.logger.info(`Found ${result.length} N_TI records for source ${ist}`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding N_TI records: ${error}`);
  //     throw error;
  //   }
  // }

  async findNTIByRecipient(subR: string): Promise<N_TI[]> {
    try {
      const result = await this.ntiRepository.find({
        where: { subR }
      });
      this.logger.info(`Found ${result.length} N_TI records for recipient ${subR}`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding N_TI records: ${error}`);
      throw error;
    }
  }

  async findAllSources(): Promise<T_IST[]> {
    try {
      const result = await this.istRepository.find();
      this.logger.info(`Found ${result.length} T_IST records`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding T_IST records: ${error}`);
      throw error;
    }
  }

  // async findSourceByIst(ist: string): Promise<T_IST | null> {
  //   try {
  //     const result = await this.istRepository.findOne({
  //       where: { ist }
  //     });
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding T_IST record: ${error}`);
  //     throw error;
  //   }
  // }

  async findAllSubjects(): Promise<T_SUB[]> {
    try {
      const result = await this.subRepository.find();
      this.logger.info(`Found ${result.length} T_SUB records`);
      return result;
    } catch (error) {
      this.logger.error(`Error finding T_SUB records: ${error}`);
      throw error;
    }
  }

  // async findActiveSubjects(): Promise<T_SUB[]> {
  //   try {
  //     const result = await this.subRepository.find({
  //       where: { act: '1' }
  //     });
  //     this.logger.info(`Found ${result.length} active T_SUB records`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding active T_SUB records: ${error}`);
  //     throw error;
  //   }
  // }
  //
  // async findSubjectBySub(sub: string): Promise<T_SUB | null> {
  //   try {
  //     const result = await this.subRepository.findOne({
  //       where: { sub }
  //     });
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding T_SUB record: ${error}`);
  //     throw error;
  //   }
  // }
  //
  // async findAllSerialNumbers(): Promise<T_S_N[]> {
  //   try {
  //     const result = await this.snRepository.find();
  //     this.logger.info(`Found ${result.length} T_S_N records`);
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding T_S_N records: ${error}`);
  //     throw error;
  //   }
  // }
  //
  // async findSerialNumber(ist: string, sub: string): Promise<T_S_N | null> {
  //   try {
  //     const result = await this.snRepository.findOne({
  //       where: { ist, sub }
  //     });
  //     return result;
  //   } catch (error) {
  //     this.logger.error(`Error finding T_S_N record: ${error}`);
  //     throw error;
  //   }
  // }
} 