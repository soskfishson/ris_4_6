import dotenv from 'dotenv';
import { centralDataSource, territorial1DataSource, territorial2DataSource } from '../src/config/database';
import { N_TI } from '../src/entities/N_TI';
import { T_IST } from '../src/entities/T_IST';
import { T_SUB } from '../src/entities/T_SUB';
import { T_S_N } from '../src/entities/T_S_N';
import { centralLogger } from '../src/config/logger';

dotenv.config();

async function seedN_TI() {
  try {
    const ntiRepository = centralDataSource.getRepository(N_TI);
    const existingRecords = await ntiRepository.count();
    
    if (existingRecords > 0) {
      centralLogger.info(`N_TI table already has ${existingRecords} records. Skipping seeding.`);
      return;
    }
    
    const territorial1Records = Array.from({ length: 5 }, (_, i) => {
      const objCode = (i + 1).toString().padStart(16, '0');
      
      return ntiRepository.create({
        ist: '101',         // Source code
        tabl: 'EXPOE',      // Table name
        pok: '1234',        // Indicator code
        ut: '00',           // Clarification code
        sub: '100001',      // Subject code (territorial1)
        otn: '00',          // Relation code
        obj: objCode,       // Object code
        vid: '01',          // Information type
        per: '01',          // Period code
        n_ti: i + 1,        // TI number
        subR: '100001',     // Recipient code (same as subject)
        name: `Object ${i + 1}`, // Object name
        act: 1              // Actuality
      });
    });
    
    // Seed records for territorial2 (5 telemetry indicators)
    const territorial2Records = Array.from({ length: 5 }, (_, i) => {
      const objCode = (i + 6).toString().padStart(16, '0');
      
      return ntiRepository.create({
        ist: '102',         // Source code
        tabl: 'EXPOE',      // Table name
        pok: '1234',        // Indicator code
        ut: '00',           // Clarification code
        sub: '100002',      // Subject code (territorial2)
        otn: '00',          // Relation code
        obj: objCode,       // Object code
        vid: '01',          // Information type
        per: '01',          // Period code
        n_ti: i + 6,        // TI number
        subR: '100002',     // Recipient code (same as subject)
        name: `Object ${i + 6}`, // Object name
        act: 1              // Actuality
      });
    });
    
    await ntiRepository.save([...territorial1Records, ...territorial2Records]);
    
    centralLogger.info('N_TI table seeded successfully');
  } catch (error) {
    centralLogger.error(`Error seeding N_TI table: ${error}`);
    throw error;
  }
}

async function seedT_IST() {
  try {
    const istRepository = centralDataSource.getRepository(T_IST);
    
    const existingRecords = await istRepository.count();
    
    if (existingRecords > 0) {
      centralLogger.info(`T_IST table already has ${existingRecords} records. Skipping seeding.`);
      return;
    }
    
    const sources = [
      istRepository.create({
        ist: '101',       // Source code
        period: '005',    // 5 minute period
        ed: 'm',          // Minutes
        dtBeg: '00',      // Start delay
        dtEnd: '02'       // End delay
      }),
      istRepository.create({
        ist: '102',       // Source code
        period: '005',    // 5 minute period
        ed: 'm',          // Minutes
        dtBeg: '00',      // Start delay
        dtEnd: '02'       // End delay
      })
    ];
    
    // Save records
    await istRepository.save(sources);
    
    centralLogger.info('T_IST table seeded successfully');
  } catch (error) {
    centralLogger.error(`Error seeding T_IST table: ${error}`);
    throw error;
  }
}

async function seedT_SUB() {
  try {
    const subRepository = centralDataSource.getRepository(T_SUB);
    
    const existingRecords = await subRepository.count();
    
    if (existingRecords > 0) {
      centralLogger.info(`T_SUB table already has ${existingRecords} records. Skipping seeding.`);
      return;
    }
    
    const subjects = [
      new T_SUB({
        act: '1',
        sub: '100001',
        subName: 'Territorial1',
        withProxy: 'N',
        subAdr: process.env.TERRITORIAL1_URL || 'http://localhost:3001',
        subPort: '3001',
        subPath: '/api/data'
      }),
      new T_SUB({
        act: '1',
        sub: '100002',
        subName: 'Territorial2',
        withProxy: 'N',
        subAdr: process.env.TERRITORIAL2_URL || 'http://localhost:3002',
        subPort: '3002',
        subPath: '/api/data'
      })
    ];
    
    await subRepository.save(subjects);
    
    centralLogger.info('T_SUB table seeded successfully');
  } catch (error) {
    centralLogger.error(`Error seeding T_SUB table: ${error}`);
    throw error;
  }
}

async function seedT_S_N() {
  try {
    const snRepository = centralDataSource.getRepository(T_S_N);
    
    const existingRecords = await snRepository.count();
    
    if (existingRecords > 0) {
      centralLogger.info(`T_S_N table already has ${existingRecords} records. Skipping seeding.`);
      return;
    }
    
    // Create serial number records
    const serialNumbers = [
      snRepository.create({
        ist: '101',     // Source code
        sub: '100001',  // Subject code (territorial1)
        sn: '1'         // Serial number
      }),
      snRepository.create({
        ist: '102',     // Source code
        sub: '100002',  // Subject code (territorial2)
        sn: '1'         // Serial number
      })
    ];
    
    // Save records
    await snRepository.save(serialNumbers);
    
    centralLogger.info('T_S_N table seeded successfully');
  } catch (error) {
    centralLogger.error(`Error seeding T_S_N table: ${error}`);
    throw error;
  }
}

async function seedDatabases() {
  try {
    centralLogger.info('Starting database seeding process');
    
    await centralDataSource.initialize();
    centralLogger.info('Central database connection initialized');
    
    await seedT_IST();
    await seedT_SUB();
    await seedT_S_N();
    await seedN_TI();
    
    centralLogger.info('Database seeding completed successfully');
    
    await centralDataSource.destroy();
    
    process.exit(0);
  } catch (error) {
    centralLogger.error(`Database seeding failed: ${error}`);
    
    if (centralDataSource.isInitialized) {
      await centralDataSource.destroy();
    }
    
    process.exit(1);
  }
}

seedDatabases();