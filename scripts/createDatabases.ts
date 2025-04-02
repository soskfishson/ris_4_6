import { Client } from 'pg';
import dotenv from 'dotenv';
import { centralLogger } from '../src/config/logger';

dotenv.config();

const centralDbName = process.env.CENTRAL_DB_NAME || 'central_db';
const territorial1DbName = process.env.TERRITORIAL1_DB_NAME || 'territorial1_db';
const territorial2DbName = process.env.TERRITORIAL2_DB_NAME || 'territorial2_db';

const pgConfig = {
  host: process.env.CENTRAL_DB_HOST || 'localhost',
  port: parseInt(process.env.CENTRAL_DB_PORT || '5432'),
  user: process.env.CENTRAL_DB_USER || 'postgres',
  password: process.env.CENTRAL_DB_PASSWORD || 'postgres',
};

async function createDatabase(dbName: string): Promise<void> {
  const client = new Client(pgConfig);
  
  try {
    await client.connect();
    centralLogger.info(`Connected to PostgreSQL server to create database: ${dbName}`);
    
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );
    
    if (result.rowCount === 0) {
      centralLogger.info(`Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      centralLogger.info(`Database ${dbName} created successfully`);
    } else {
      centralLogger.info(`Database ${dbName} already exists`);
    }
  } catch (error) {
    centralLogger.error(`Error creating database ${dbName}: ${error}`);
    throw error;
  } finally {
    await client.end();
  }
}

async function createDatabases(): Promise<void> {
  try {
    centralLogger.info('Starting database creation process');
    
    await createDatabase(centralDbName);
    await createDatabase(territorial1DbName);
    await createDatabase(territorial2DbName);
    
    centralLogger.info('All databases created successfully');
  } catch (error) {
    centralLogger.error(`Database creation failed: ${error}`);
    process.exit(1);
  }
}

createDatabases();