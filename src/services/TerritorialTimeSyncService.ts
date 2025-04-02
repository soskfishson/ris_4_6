import axios from 'axios';
import { territorial1Logger, territorial2Logger } from '../config/logger';

export class TerritorialTimeSyncService {
  private centralUrl: string;
  private serviceName: string;
  private logger: any;
  private localOffset: number = 0;

  constructor(centralUrl: string, serviceName: string) {
    this.centralUrl = centralUrl;
    this.serviceName = serviceName;
    this.logger = serviceName === 'territorial1' ? territorial1Logger : territorial2Logger;
  }

  async synchronize(): Promise<void> {
    try {
      this.logger.info('Starting time synchronization');
      
      const t0 = Date.now();
      
      const response = await axios.get(`${this.centralUrl}/api/time`);
      
      const t1 = Date.now();
      
      const roundTripTime = t1 - t0;
      
      const serverTime = new Date(response.data.time).getTime();
      
      const oneWayDelay = roundTripTime / 2;
      
      const estimatedServerSendTime = t1 - oneWayDelay;
      
      this.localOffset = serverTime - estimatedServerSendTime;
      
      this.logger.info(`Time synchronized. Local offset: ${this.localOffset}ms, Round-trip: ${roundTripTime}ms`);
    } catch (error) {
      this.logger.error(`Time synchronization failed: ${error}`);
      throw error;
    }
  }

  getCorrectedTime(): Date {
    const currentLocalTime = Date.now();
    const correctedTime = new Date(currentLocalTime + this.localOffset);
    return correctedTime;
  }

  getOffset(): number {
    return this.localOffset;
  }

  startPeriodicSync(interval: number = 1000 * 30): void {
    this.logger.info(`Starting periodic time synchronization every ${interval / 1000} seconds`);
    
    this.synchronize().catch(error => {
      this.logger.error(`Initial time synchronization failed: ${error}`);
    });
    
    setInterval(() => {
      this.synchronize().catch(error => {
        this.logger.error(`Periodic time synchronization failed: ${error}`);
      });
    }, interval);
  }
} 