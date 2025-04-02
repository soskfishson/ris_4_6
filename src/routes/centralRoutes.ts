import { Router } from 'express';
import { CentralController } from '../controllers/CentralController';
import { DataSource } from 'typeorm';

export const createCentralRoutes = (dataSource: DataSource): Router => {
  const router = Router();
  const controller = new CentralController(dataSource);

  router.get('/api/time', controller.getTime);
  
  router.get('/api/status', controller.getSystemStatus);
  
  router.get('/api/data', controller.getData);

  return router;
}; 