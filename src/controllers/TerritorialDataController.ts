import { Request, Response } from 'express';
import { BODIRepository } from '../repositories/BODIRepository';
import { BODKRepository } from '../repositories/BODKRepository';
import { BODI } from '../entities/BODI';
import { BODK } from '../entities/BODK';
import { DataSource } from 'typeorm';
import { territorial1Logger, territorial2Logger } from '../config/logger';
import { TerritorialTimeSyncService } from '../services/TerritorialTimeSyncService';

export class TerritorialDataController {
  private bodiRepository: BODIRepository;
  private bodkRepository: BODKRepository;
  private timeSyncService: TerritorialTimeSyncService;
  private logger: any;

  constructor(dataSource: DataSource, serviceName: string) {
    this.bodiRepository = new BODIRepository(dataSource, serviceName);
    this.bodkRepository = new BODKRepository(dataSource, serviceName);
    this.logger = serviceName === 'territorial1' ? territorial1Logger : territorial2Logger;
    
    // Initialize time sync service
    const centralUrl = process.env.CENTRAL_URL || 'http://localhost:3000';
    this.timeSyncService = new TerritorialTimeSyncService(centralUrl, serviceName);
  }

  getTime = (_req: Request, res: Response): void => {
    try {
      const currentTime = this.timeSyncService.getCorrectedTime();
      this.logger.info(`Sending synchronized server time: ${currentTime}`);
      
      res.status(200).json({
        time: currentTime
      });
    } catch (error) {
      this.logger.error(`Error getting server time: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  getData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { ist, since } = req.query;
      
      if (!ist) {
        res.status(400).json({ error: 'Source (ist) parameter is required' });
        return;
      }
      
      const sinceDate = since ? new Date(since as string) : new Date(0);
      
      this.logger.info(`Fetching data for source ${ist} since ${sinceDate}`);
      
      // Find BODI records
      const bodiRecords = await this.bodiRepository.findByTimeRange(sinceDate, new Date());
      
      // Filter by source if provided
      const filteredRecords = ist ? bodiRecords.filter(record => record.ist === ist) : bodiRecords;
      
      // Get corresponding BODK record if BODI records exist
      let bodkRecord = null;
      
      if (filteredRecords.length > 0) {
        bodkRecord = await this.bodkRepository.findBySourceAndTime(
          filteredRecords[0].ist, 
          filteredRecords[0].datvSet
        );
      }
      
      this.logger.info(`Returning ${filteredRecords.length} BODI records for source ${ist}`);
      
      res.status(200).json({
        bodiRecords: filteredRecords,
        bodkRecord
      });
    } catch (error) {
      this.logger.error(`Error getting data: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  receiveData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { bodiRecords, bodkRecord } = req.body;
      
      if (!bodiRecords || !Array.isArray(bodiRecords) || !bodkRecord) {
        res.status(400).json({ error: 'Invalid payload format' });
        return;
      }
      
      this.logger.info(`Received ${bodiRecords.length} BODI records from central organization`);
      
      if (bodiRecords.length > 0) {
        const bodiInstances = bodiRecords.map((record: any) => {
          const bodi = new BODI();
          Object.assign(bodi, {
            ...record,
            datv: new Date(record.datv),
            datvSet: new Date(record.datvSet)
          });
          return bodi;
        });
        
        await this.bodiRepository.saveMany(bodiInstances);
      }
      
      if (bodkRecord) {
        const bodk = new BODK();
        Object.assign(bodk, {
          ...bodkRecord,
          datvSet: new Date(bodkRecord.datvSet)
        });
        
        await this.bodkRepository.save(bodk);
      }
      
      this.logger.info('Successfully saved received data');
      
      res.status(200).json({ success: true });
    } catch (error) {
      this.logger.error(`Error receiving data: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  getStatus = async (_req: Request, res: Response): Promise<void> => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const recentRecords = await this.bodiRepository.findByTimeRange(oneDayAgo, new Date());
      
      res.status(200).json({
        status: 'healthy',
        recordsLast24h: recentRecords.length,
        lastUpdateTime: recentRecords.length > 0 ? 
          recentRecords[recentRecords.length - 1].datvSet : null
      });
    } catch (error) {
      this.logger.error(`Error getting status: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 