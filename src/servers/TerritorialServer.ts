import express from 'express';
import cors from 'cors';
import { createTerritorialRoutes } from '../routes/territorialRoutes';
import { DataSource } from 'typeorm';
import { TerritorialTimeSyncService } from '../services/TerritorialTimeSyncService';
import { DataGeneratorService } from '../services/DataGeneratorService';
import dotenv from 'dotenv';

dotenv.config();

export class TerritorialServer {
  private app: express.Application;
  private port: number;
  private centralUrl: string;
  private studentNumber: number;
  private serviceName: string;
  private dataSource: DataSource;
  private logger: any;

  constructor(
    port: number,
    centralUrl: string,
    studentNumber: number,
    serviceName: string,
    dataSource: DataSource,
    logger: any
  ) {
    this.app = express();
    this.port = port;
    this.centralUrl = centralUrl;
    this.studentNumber = studentNumber;
    this.serviceName = serviceName;
    this.dataSource = dataSource;
    this.logger = logger;

    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      this.logger.info(`${req.method} ${req.url}`);
      next();
    });
  }

  private setupRoutes(): void {
    this.app.get('/health', (_, res) => {
      res.status(200).json({ status: 'ok', service: this.serviceName });
    });

    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      this.logger.error(`Error: ${err.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    });
  }

  public async start(): Promise<void> {
    try {
      await this.dataSource.initialize();
      this.logger.info('Database connection initialized');

      this.app.use(createTerritorialRoutes(this.dataSource, this.serviceName));

      const timeSyncService = new TerritorialTimeSyncService(this.centralUrl, this.serviceName);
      const dataGeneratorService = new DataGeneratorService(
        this.dataSource,
        this.serviceName,
        this.studentNumber
      );

      this.app.listen(this.port, () => {
        this.logger.info(`${this.serviceName} server running on port ${this.port}`);
        
        timeSyncService.startPeriodicSync(30000);
        
        setInterval(() => {
          dataGeneratorService.generateData(10)
            .catch(error => this.logger.error(`Error generating test data: ${error}`));
        }, 70000);
        
        dataGeneratorService.generateData(10)
          .then(() => this.logger.info('Initial test data generated'))
          .catch(error => this.logger.error(`Error generating initial test data: ${error}`));
      });
    } catch (error) {
      this.logger.error(`Failed to start ${this.serviceName} server: ${error}`);
      process.exit(1);
    }
  }
} 