export default (collectionName: string) => 

`import { Router } from 'https://deno.land/x/oak/mod.ts';
import { getAll, getOne, create, update, deleteOne } from '../controllers/defaultController.ts';

const router = new Router({ prefix: '/api/${collectionName}' });

router
  .get('/', getAll)
  .get('/:id', getOne)
  .post('/', create)
  .put('/:id', update)
  .delete('/:id', deleteOne);

export default router;
`;