import { Pool } from 'https://deno.land/x/postgres@v0.7.0/mod.ts';
import { PoolClient } from 'https://deno.land/x/postgres/client.ts';

const POOL_CONNECTIONS = 1;
export const dbPool = new Pool(
  {
    user: 'rmybujry',
    password: '3FFtxtka6wwc49VgxiqqF7IkbS2pnZgb',
    database: 'rmybujry',
    hostname: 'ziggy.db.elephantsql.com',
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
}
