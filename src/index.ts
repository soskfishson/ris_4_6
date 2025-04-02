import dotenv from 'dotenv';
import { centralLogger } from './config/logger';

dotenv.config();

const SERVICE_TYPE = process.env.SERVICE_TYPE || 'central';

async function main() {
  try {
    switch (SERVICE_TYPE.toLowerCase()) {
      case 'central':
        centralLogger.info('Starting central service');
        await import('./servers/centralServer');
        break;
        
      case 'territorial1':
        centralLogger.info('Starting territorial1 service');
        await import('./servers/territorial1Server');
        break;
        
      case 'territorial2':
        centralLogger.info('Starting territorial2 service');
        await import('./servers/territorial2Server');
        break;
        
      default:
        centralLogger.error(`Unknown service type: ${SERVICE_TYPE}`);
        console.error(`Unknown service type: ${SERVICE_TYPE}`);
        process.exit(1);
    }
  } catch (error) {
    centralLogger.error(`Failed to start service: ${error}`);
    console.error(`Failed to start service: ${error}`);
    process.exit(1);
  }
}

main();
