import axios from 'axios';
import { centralLogger } from '../config/logger';

export class TimeSyncService {
  private centralUrl: string;
  private territorialUrls: string[];
  private logger = centralLogger;

  constructor(centralUrl: string, territorialUrls: string[]) {
    this.centralUrl = centralUrl;
    this.territorialUrls = territorialUrls;
  }

  async getTimeDifferences(): Promise<Array<{url: string, difference: number}>> {
    const differences: Array<{url: string, difference: number}> = [];
    const centralResponse = await axios.get(`${this.centralUrl}/api/time`);
    const centralTime = new Date(centralResponse.data.time);

    for (const url of this.territorialUrls) {
      try {
        const territorialResponse = await axios.get(`${url}/api/time`);
        const territorialTime = new Date(territorialResponse.data.time);
        differences.push({
          url,
          difference: Math.abs(centralTime.getTime() - territorialTime.getTime())
        });
      } catch (error) {
        differences.push({ url, difference: -1 });
      }
    }

    return differences;
  }
}