import { TerritorialServer } from './TerritorialServer';
import { territorial1DataSource } from '../config/database';
import { territorial1Logger } from '../config/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = parseInt(process.env.TERRITORIAL1_PORT || '3001');
const CENTRAL_URL = process.env.CENTRAL_URL || 'http://localhost:3000';
const STUDENT_NUMBER = parseInt(process.env.STUDENT_NUMBER || '1');

const server = new TerritorialServer(
  PORT,
  CENTRAL_URL,
  STUDENT_NUMBER,
  'territorial1',
  territorial1DataSource,
  territorial1Logger
);

server.start(); 