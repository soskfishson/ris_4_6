import { Request, Response } from 'express';
import { BODIRepository } from '../repositories/BODIRepository';
import { BODKRepository } from '../repositories/BODKRepository';
import { NTIRepository } from '../repositories/NTIRepository';
import { DataSource } from 'typeorm';
import { centralLogger } from '../config/logger';
import { TimeSyncService } from '../services/TimeSyncService';

export class CentralController {
  private bodiRepository: BODIRepository;
  private bodkRepository: BODKRepository;
  private ntiRepository: NTIRepository;
  private timeSyncService: TimeSyncService;
  private logger = centralLogger;

  constructor(dataSource: DataSource) {
    this.bodiRepository = new BODIRepository(dataSource, 'central');
    this.bodkRepository = new BODKRepository(dataSource, 'central');
    this.ntiRepository = new NTIRepository(dataSource);
    
    const centralUrl = process.env.CENTRAL_SERVICE_URL || 'http://localhost:3000';
    const territorialUrls = [
      process.env.TERRITORIAL1_SERVICE_URL || 'http://localhost:3001',
      process.env.TERRITORIAL2_SERVICE_URL || 'http://localhost:3002'
    ];
    this.timeSyncService = new TimeSyncService(centralUrl, territorialUrls);
  }

  getTime = (_req: Request, res: Response): void => {
    res.status(200).json({ time: new Date() });
  };

  getSystemStatus = async (_req: Request, res: Response): Promise<void> => {
    const subjects = await this.ntiRepository.findAllSubjects();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const recentRecords = await this.bodiRepository.findByTimeRange(oneDayAgo, new Date());
    const recordsBySubject = new Map<string, number>();
    
    recentRecords.forEach(record => {
      const count = recordsBySubject.get(record.sub) || 0;
      recordsBySubject.set(record.sub, count + 1);
    });
    
    const sources = await this.ntiRepository.findAllSources();
    const timeDifferences = await this.timeSyncService.getTimeDifferences();
    
    res.status(200).json({
      status: 'healthy',
      centralService: {
        recordsLast24h: recentRecords.length,
        lastUpdateTime: recentRecords.length > 0 ? recentRecords[recentRecords.length - 1].datvSet : null
      },
      subjects: subjects.map(subject => ({
        name: subject.subName,
        code: subject.sub,
        recordsLast24h: recordsBySubject.get(subject.sub) || 0
      })),
      sources: sources.map(source => ({
        code: source.ist,
        period: source.period,
        exchangeUnit: source.ed
      })),
      timeSync: {
        differences: timeDifferences,
        lastSync: new Date()
      }
    });
  };

  getData = async (req: Request, res: Response): Promise<void> => {
    const { ist, since, sub } = req.query;
    
    if (!ist) {
      res.status(400).json({ error: 'Source (ist) parameter is required' });
      return;
    }
    
    const sinceDate = since ? new Date(since as string) : new Date(0);
    const bodiRecords = await this.bodiRepository.findByTimeRange(sinceDate, new Date());
    let filteredRecords = bodiRecords.filter(record => record.ist === ist);
    
    if (sub) {
      filteredRecords = filteredRecords.filter(record => record.sub === sub);
    }
    
    let bodkRecord = null;
    if (filteredRecords.length > 0) {
      bodkRecord = await this.bodkRepository.findBySourceAndTime(
        filteredRecords[0].ist, 
        filteredRecords[0].datvSet
      );
    }
    
    res.status(200).json({
      bodiRecords: filteredRecords,
      bodkRecord
    });
  };
} 