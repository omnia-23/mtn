import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './models';
import dotenv from 'dotenv';
import HttpError from '../utils/HttpError';

dotenv.config();

const PGSQL_DB_USER = process.env.POSTGRES_USER;
const PGSQL_DB_HOST = process.env.POSTGRES_HOST;
const PGSQL_DB_NAME = process.env.POSTGRES_DB;
const PGSQL_DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const PGSQL_DB_PORT = process.env.POSTGRES_PORT;

if (!PGSQL_DB_USER || !PGSQL_DB_PASSWORD || !PGSQL_DB_NAME) {
  throw new HttpError(500, 'Database configuration variables are missing!');
}
const conString = `postgres://${PGSQL_DB_USER}:${PGSQL_DB_PASSWORD}@${PGSQL_DB_HOST}:${PGSQL_DB_PORT}/${PGSQL_DB_NAME}`;
export const sql = postgres(conString, { max: 1 });

const migrationClient = drizzle(sql);

export const syncTables = async () =>
  await migrate(migrationClient, { migrationsFolder: './src/migrations' }).then(async () => {
    sql.end();
  });

const querySql = postgres(conString);
const queryClient = drizzle(querySql, {
  schema,
});

export default queryClient;
