



import type { Request, Response } from 'express';
import { sendSuccess, asyncHandler, sendError } from '../middleware/responseHandler';

const { Pool } = await import('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'dicta',
  password: process.env.DB_PASSWORD || 'dicta',
  database: process.env.DB_NAME || 'dicta',
});


export const checkAPIHealth = (_req: Request, res: Response) => {
  sendSuccess(res, {
    message: 'Server is running',
  })
}

export const checkDBHealth = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, $1 as test_value', ['PostgreSQL connected!']);
    client.release();
    await pool.end();

    sendSuccess(res, {
      connected: true,
      currentTime: result.rows[0].current_time,
      testValue: result.rows[0].test_value
    })
  } catch (error) {
    console.error('Database connection error:', error);
    sendError(res, 'Database test failed')
  }

})