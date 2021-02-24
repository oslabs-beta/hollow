import { Router } from 'oak';
import { runQuery } from '../secret.ts';

import defaultController from '../controllers/defaultController.ts';

const router = new Router({ prefix: '/api' });

const result = await runQuery(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name != 'pg_stat_statements'
`);
const tables = result.rows.map((tableArr: any) => tableArr.table_name);

tables.forEach((collectionName: string) => {
  router.use(`/${collectionName}`, async (ctx: any, next: any) => {
    ctx.state.collectionName = collectionName;
    return await next();
  });

  router.get(`/${collectionName}`, defaultController.getAll);
  router.get(`/${collectionName}/:id`, defaultController.getOne);
  router.post(`/${collectionName}`, defaultController.create);
  router.put(`/${collectionName}/:id`, defaultController.update);
  router.delete(`/${collectionName}/:id`, defaultController.delete);
});

export default router;