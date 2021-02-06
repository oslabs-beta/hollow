export default (collectionName: string) => 

`import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import { getAll, getOne, create, update, deleteOne } from '../controllers/defaultController.ts';

const router = new Router({ prefix: '/api/${collectionName}' });

router.use(async (ctx, next) => {
  ctx.state.collectionName = '${collectionName}';
  return await next();
});

router
  .get('/', getAll)
  .get('/:id', getOne)
  .post('/', create)
  .put('/:id', update)
  .delete('/:id', deleteOne);

export default router;
`;