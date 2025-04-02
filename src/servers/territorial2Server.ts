import { TerritorialServer } from './TerritorialServer';
import { territorial2DataSource } from '../config/database';
import { territorial2Logger } from '../config/logger';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.TERRITORIAL2_PORT) || 3002;
const CENTRAL_URL = process.env.CENTRAL_URL || 'http://localhost:3000';
const STUDENT_NUMBER = parseInt(process.env.STUDENT_NUMBER || '1');

const server = new TerritorialServer(
  PORT,
  CENTRAL_URL,
  STUDENT_NUMBER + 10,
  'territorial2',
  territorial2DataSource,
  territorial2Logger
);

server.start();