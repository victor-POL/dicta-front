import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import pool from '../config/database';

export interface DatabaseError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
}

export interface QueryOptions {
  text: string;
  values?: any[];
}

export class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  /**
   * Execute a simple query
   */
  async query<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<QueryResult<T>> {
    const start = Date.now();
    
    try {
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;
      
      console.log(`📊 Query executed in ${duration}ms:`, { text, rowCount: result.rowCount });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ Query failed after ${duration}ms:`, { text, error: (error as Error).message });
      throw this.handleDatabaseError(error as DatabaseError);
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      console.log('🔄 Transaction started');
      
      const result = await callback(client);
      
      await client.query('COMMIT');
      console.log('✅ Transaction committed');
      
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('🔄 Transaction rolled back:', (error as Error).message);
      throw this.handleDatabaseError(error as DatabaseError);
    } finally {
      client.release();
    }
  }

  /**
   * Execute a query within a transaction client
   */
  async transactionQuery<T extends QueryResultRow = QueryResultRow>(
    client: PoolClient, 
    text: string, 
    params?: any[]
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    
    try {
      const result = await client.query<T>(text, params);
      const duration = Date.now() - start;
      
      console.log(`📊 Transaction query executed in ${duration}ms:`, { text, rowCount: result.rowCount });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`❌ Transaction query failed after ${duration}ms:`, { text, error: (error as Error).message });
      throw this.handleDatabaseError(error as DatabaseError);
    }
  }

  /**
   * Get a single row or null
   */
  async findOne<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<T | null> {
    const result = await this.query<T>(text, params);
    return result.rows[0] || null;
  }

  /**
   * Get multiple rows
   */
  async findMany<T extends QueryResultRow = QueryResultRow>(text: string, params?: any[]): Promise<T[]> {
    const result = await this.query<T>(text, params);
    return result.rows;
  }

  /**
   * Check if table exists
   */
  async tableExists(tableName: string): Promise<boolean> {
    const result = await this.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    );
    return result.rows[0].exists;
  }

  /**
   * Get table information
   */
  async getTableInfo(tableName: string): Promise<any[]> {
    return this.findMany(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [tableName]);
  }

  /**
   * Handle database errors with more meaningful messages
   */
  private handleDatabaseError(error: DatabaseError): Error {
    const { code, detail, constraint, table } = error;
    
    switch (code) {
      case '23505': // unique_violation
        return new Error(`Duplicate entry: ${constraint ? constraint.replace(/_/g, ' ') : 'unique constraint violated'}`);
      
      case '23503': // foreign_key_violation
        return new Error(`Foreign key constraint violated: ${constraint || 'invalid reference'}`);
      
      case '23502': // not_null_violation
        return new Error(`Required field cannot be null: ${constraint || 'not null constraint violated'}`);
      
      case '42P01': // undefined_table
        return new Error(`Table does not exist: ${table || 'unknown table'}`);
      
      case '42703': // undefined_column
        return new Error(`Column does not exist: ${detail || 'unknown column'}`);
      
      case '28P01': // invalid_password
        return new Error('Database authentication failed: invalid credentials');
      
      case 'ECONNREFUSED':
        return new Error('Database connection refused: check if PostgreSQL is running');
      
      case 'ENOTFOUND':
        return new Error('Database host not found: check connection settings');
      
      default:
        return new Error(`Database error: ${error.message}`);
    }
  }

  /**
   * Get connection pool stats
   */
  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
export const db = new DatabaseService();
export default db;