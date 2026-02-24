import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/audit_logs',
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
  STS_URL: process.env.STS_URL || 'http://localhost:3000',
  SERVER_URL: process.env.SERVER_URL || 'http://localhost:3001',
  APPLICATION_REDIRECT_URL: process.env.APPLICATION_REDIRECT_URL || 'http://localhost:3001',
};
