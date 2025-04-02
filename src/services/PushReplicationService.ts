import axios from 'axios';
import { BODIRepository } from '../repositories/BODIRepository';
import { BODKRepository } from '../repositories/BODKRepository';
import { DataSource } from 'typeorm';
import { replicationLogger } from '../config/logger';
import { NTIRepository } from '../repositories/NTIRepository';

export class PushReplicationService {
  private centralBodiRepo: BODIRepository;
  private centralBodkRepo: BODKRepository;
  private ntiRepo: NTIRepository;
  private logger = replicationLogger;
  private territoralEndpoints: Array<{ name: string, sub: string, url: string }>;

  constructor(
    centralDataSource: DataSource, 
    territoralEndpoints: Array<{ name: string, sub: string, url: string }>
  ) {
    this.centralBodiRepo = new BODIRepository(centralDataSource, 'central');
    this.centralBodkRepo = new BODKRepository(centralDataSource, 'central');
    this.ntiRepo = new NTIRepository(centralDataSource);
    this.territoralEndpoints = territoralEndpoints;
  }


  async pushToTerritorial(territorialName: string, territorialSub: string, territorialUrl: string): Promise<void> {
    try {
      this.logger.info(`Starting push replication to ${territorialName}`);
      
      const ntiRecords = await this.ntiRepo.findNTIByRecipient(territorialSub);
      
      if (ntiRecords.length === 0) {
        this.logger.info(`No N_TI records found for recipient ${territorialSub}`);
        return;
      }
      
      const sourceMap = new Map<string, string[]>();
      
      ntiRecords.forEach(record => {
        if (!sourceMap.has(record.ist)) {
          sourceMap.set(record.ist, []);
        }
        sourceMap.get(record.ist)?.push(record.obj);
      });
      
      for (const [ist, objects] of sourceMap.entries()) {
        try {
          const bodiRecords = await this.centralBodiRepo.findBySource(ist);
          
          const filteredRecords = bodiRecords.filter(record =>
            objects.includes(record.obj)
          );
          
          if (filteredRecords.length === 0) {
            this.logger.info(`No BODI records to push for source ${ist} to ${territorialName}`);
            continue;
          }
          
          const bodkRecord = await this.centralBodkRepo.findBySourceAndTime(
            filteredRecords[0].ist, 
            filteredRecords[0].datvSet
          );
          
          if (!bodkRecord) {
            this.logger.warn(`No BODK record found for BODI records with source ${ist}`);
            continue;
          }
          
          await axios.post(`${territorialUrl}/api/data`, {
            bodiRecords: filteredRecords,
            bodkRecord
          }, {
            timeout: 30000
          });
          
          this.logger.info(`Successfully pushed ${filteredRecords.length} BODI records to ${territorialName} for source ${ist}`);
        } catch (sourceError) {
          this.logger.error(`Error pushing data for source ${ist} to ${territorialName}: ${sourceError}`);
        }
      }
      
      this.logger.info(`Completed push replication to ${territorialName}`);
    } catch (error) {
      this.logger.error(`Failed to push data to ${territorialName}: ${error}`);
      throw error;
    }
  }


  async pushToAllTerritorials(): Promise<void> {
    this.logger.info('Starting push replication to all territorial organizations');
    
    const pushPromises = this.territoralEndpoints.map(endpoint => 
      this.pushToTerritorial(endpoint.name, endpoint.sub, endpoint.url)
        .catch(error => {
          this.logger.error(`Push to ${endpoint.name} failed: ${error}`);
        })
    );
    
    await Promise.all(pushPromises);
    
    this.logger.info('Completed push replication to all territorial organizations');
  }


  startPeriodicPushing(interval: number = 1000 * 60): void {
    this.logger.info(`Starting periodic push replication every ${interval / 1000} seconds`);
    
    this.pushToAllTerritorials().catch(error => {
      this.logger.error(`Initial push replication failed: ${error}`);
    });
    
    setInterval(() => {
      this.pushToAllTerritorials().catch(error => {
        this.logger.error(`Periodic push replication failed: ${error}`);
      });
    }, interval);
  }
} 