import { Router } from 'express';
import { TerritorialDataController } from '../controllers/TerritorialDataController';
import { DataSource } from 'typeorm';
import { DataGeneratorService } from '../services/DataGeneratorService';

export const createTerritorialRoutes = (dataSource: DataSource, serviceName: string): Router => {
  const router = Router();
  const controller = new TerritorialDataController(dataSource, serviceName);
  
  const dataGeneratorService = new DataGeneratorService(
    dataSource,
    serviceName,
    parseInt(process.env.STUDENT_NUMBER || '1') + (serviceName === 'territorial2' ? 10 : 0)
  );

  router.get('/api/time', controller.getTime);
  router.get('/api/data', controller.getData);
  
  router.post('/api/data', controller.receiveData);
  
  router.get('/api/status', controller.getStatus);
  
  router.post('/api/generate-data', async (req, res) => {
    try {
      const count = req.body.count || 10;
      await dataGeneratorService.generateData(count);
      res.status(200).json({ 
        success: true, 
        message: `Generated ${count} test data records for ${serviceName}` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: `Failed to generate test data: ${error}` 
      });
    }
  });

  return router;
}; 