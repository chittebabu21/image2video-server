// imports
import { createPool, PoolConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

// create pool with credentials
export const pool = createPool({
    host: process.env.MYSQL_HOSTNAME,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : undefined,
    connectionLimit: 100
});