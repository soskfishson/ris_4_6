import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const centralDataSource = new DataSource({
  type: 'postgres',
  host: process.env.CENTRAL_DB_HOST || 'localhost',
  port: parseInt(process.env.CENTRAL_DB_PORT || '5432'),
  username: process.env.CENTRAL_DB_USER || 'postgres',
  password: process.env.CENTRAL_DB_PASSWORD || 'postgres',
  database: process.env.CENTRAL_DB_NAME || 'central_db',
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});

export const territorial1DataSource = new DataSource({
  type: 'postgres',
  host: process.env.TERRITORIAL1_DB_HOST || 'localhost',
  port: parseInt(process.env.TERRITORIAL1_DB_PORT || '5432'),
  username: process.env.TERRITORIAL1_DB_USER || 'postgres',
  password: process.env.TERRITORIAL1_DB_PASSWORD || 'postgres',
  database: process.env.TERRITORIAL1_DB_NAME || 'territorial1_db',
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
});

export const territorial2DataSource = new DataSource({
  type: 'postgres',
  host: process.env.TERRITORIAL2_DB_HOST || 'localhost',
  port: parseInt(process.env.TERRITORIAL2_DB_PORT || '5432'),
  username: process.env.TERRITORIAL2_DB_USER || 'postgres',
  password: process.env.TERRITORIAL2_DB_PASSWORD || 'postgres',
  database: process.env.TERRITORIAL2_DB_NAME || 'territorial2_db',
  entities: [path.join(__dirname, '../entities/**/*.{ts,js}')],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
}); 