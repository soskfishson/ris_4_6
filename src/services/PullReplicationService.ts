import axios from 'axios';
import { BODIRepository } from '../repositories/BODIRepository';
import { BODKRepository } from '../repositories/BODKRepository';
import { BODI } from '../entities/BODI';
import { BODK } from '../entities/BODK';
import { DataSource } from 'typeorm';
import { replicationLogger } from '../config/logger';
import { NTIRepository } from '../repositories/NTIRepository';

export class PullReplicationService {
  private centralBodiRepo: BODIRepository;
  private centralBodkRepo: BODKRepository;
  private ntiRepo: NTIRepository;
  private logger = replicationLogger;
  private territoralEndpoints: Array<{ name: string, url: string }>;

  constructor(
    centralDataSource: DataSource, 
    territoralEndpoints: Array<{ name: string, url: string }>
  ) {
    this.centralBodiRepo = new BODIRepository(centralDataSource, 'central');
    this.centralBodkRepo = new BODKRepository(centralDataSource, 'central');
    this.ntiRepo = new NTIRepository(centralDataSource);
    this.territoralEndpoints = territoralEndpoints;
  }


  async pullFromTerritorial(territorialName: string, territorialUrl: string): Promise<void> {
    try {
      this.logger.info(`Starting pull replication from ${territorialName}`);
      
      const sources = await this.ntiRepo.findAllSources();
      
      for (const source of sources) {
        const ist = source.ist;
        
        try {
          const latestBODK = await this.centralBodkRepo.findLatestBySource(ist);
          const lastSyncTime = latestBODK ? latestBODK.datvSet : new Date(0);
          
          this.logger.info(`Pulling data for source ${ist} from ${territorialName} since ${lastSyncTime}`);
          
          const response = await axios.get(`${territorialUrl}/api/data`, {
            params: {
              ist,
              since: lastSyncTime.toISOString()
            },
            timeout: 30000
          });
          
          if (!response.data || !response.data.bodiRecords || !response.data.bodkRecord) {
            this.logger.warn(`No data received from ${territorialName} for source ${ist}`);
            continue;
          }
          
          const { bodiRecords, bodkRecord } = response.data;
          
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
            
            await this.centralBodiRepo.saveMany(bodiInstances);
          }
          
          if (bodkRecord) {
            const bodk = new BODK();
            Object.assign(bodk, {
              ...bodkRecord,
              datvSet: new Date(bodkRecord.datvSet)
            });
            
            await this.centralBodkRepo.save(bodk);
          }
          
          this.logger.info(`Successfully pulled ${bodiRecords.length} BODI records from ${territorialName} for source ${ist}`);
        } catch (sourceError) {
          this.logger.error(`Error pulling data for source ${ist} from ${territorialName}: ${sourceError}`);
        }
      }
      
      this.logger.info(`Completed pull replication from ${territorialName}`);
    } catch (error) {
      this.logger.error(`Failed to pull data from ${territorialName}: ${error}`);
      throw error;
    }
  }


  async pullFromAllTerritorials(): Promise<void> {
    this.logger.info('Starting pull replication from all territorial organizations');
    
    const pullPromises = this.territoralEndpoints.map(endpoint => 
      this.pullFromTerritorial(endpoint.name, endpoint.url)
        .catch(error => {
          this.logger.error(`Pull from ${endpoint.name} failed: ${error}`);
        })
    );
    
    await Promise.all(pullPromises);
    
    this.logger.info('Completed pull replication from all territorial organizations');
  }

  startPeriodicPulling(interval: number = 1000 * 60): void {
    this.logger.info(`Starting periodic pull replication every ${interval / 1000} seconds`);
    this.pullFromAllTerritorials().catch(error => {
      this.logger.error(`Initial pull replication failed: ${error}`);
    });
    setInterval(() => {
      this.pullFromAllTerritorials().catch(error => {
        this.logger.error(`Periodic pull replication failed: ${error}`);
      });
    }, interval);
  }
} 