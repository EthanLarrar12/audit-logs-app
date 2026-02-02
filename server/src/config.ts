import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/audit_logs',
  NODE_ENV: (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test',
};
