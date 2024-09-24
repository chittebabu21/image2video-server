// error types
type MysqlErrorCode = 'ER_ACCESS_DENIED_ERROR' | 'ER_BAD_DB_ERROR' | 'PROTOCOL_CONNECTION_LOST' | 'ER_CON_COUNT_ERROR' | 'ECONNREFUSED';

export interface MysqlError extends Error {
  code?: MysqlErrorCode;
}