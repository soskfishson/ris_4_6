import express from 'express';
import cors from 'cors';
import { createCentralRoutes } from '../routes/centralRoutes';
import { centralDataSource } from '../config/database';
import { centralLogger } from '../config/logger';
import { PullReplicationService } from '../services/PullReplicationService';
import { PushReplicationService } from '../services/PushReplicationService';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.CENTRAL_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  centralLogger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok', service: 'central' });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  centralLogger.error(`Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

const startServer = async () => {
  try {
    await centralDataSource.initialize();
    centralLogger.info('Database connection initialized');

    app.use(createCentralRoutes(centralDataSource));

    const pullReplicationService = new PullReplicationService(centralDataSource, [
      { name: 'territorial1', url: process.env.TERRITORIAL1_URL || 'http://localhost:3001' },
      { name: 'territorial2', url: process.env.TERRITORIAL2_URL || 'http://localhost:3002' }
    ]);

    const pushReplicationService = new PushReplicationService(centralDataSource, [
      { 
        name: 'territorial1', 
        sub: '100001', 
        url: process.env.TERRITORIAL1_URL || 'http://localhost:3001' 
      },
      { 
        name: 'territorial2', 
        sub: '100002', 
        url: process.env.TERRITORIAL2_URL || 'http://localhost:3002' 
      }
    ]);

    app.listen(PORT, () => {
      centralLogger.info(`Central server running on port ${PORT}`);
      
      pullReplicationService.startPeriodicPulling(60000);
      pushReplicationService.startPeriodicPushing(60001);
    });
  } catch (error) {
    centralLogger.error(`Failed to start central server: ${error}`);
    process.exit(1);
  }
};

startServer();