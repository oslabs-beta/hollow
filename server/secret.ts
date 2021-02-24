import { Pool } from 'https://deno.land/x/postgres@v0.7.0/mod.ts';
import { PoolClient } from 'https://deno.land/x/postgres/client.ts';

const POOL_CONNECTIONS = 1;
export const dbPool = new Pool(
  {
    user: Deno.env.get('RDS_USERNAME'),
    database: Deno.env.get('RDS_DB_NAME'),
    password: Deno.env.get('RDS_PASSWORD'),
    hostname: Deno.env.get('RDS_HOSTNAME'),
    port: 5432,
  },
  POOL_CONNECTIONS
);

export async function runQuery(query: string, param?: string | string[]) {
  // @ts-ignore
  const client: PoolClient = await dbPool.connect();
  let dbResult;
  if (param) dbResult = await client.queryObject(query, ...param);
  else dbResult = await client.queryObject(query);
  client.release();
  return dbResult;
};
