import { Application, Router, isHttpError, Status } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import tableRouter from './routes/tableRouter.ts';
import defaultController from './controllers/defaultController.ts';
import { runQuery } from './secret.ts';

import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { render } from 'https://unpkg.com/preact-render-to-string@5.1.12?module';
import App from '../client/components/App.tsx';

const init = async (app: any, controller: any, port: number) => {
  // const PORT = 3000;
  // const app = new Application();

  // const controller = new AbortController();
  // const { signal } = controller;

  const router = new Router();
  let apiRouter = new Router({ prefix: '/api' });

  router.get('/', async (ctx) => {
    const app = render(<App />);
    ctx.response.headers.set('Content-Type', 'text/html');
    const html = 
      `<!DOCTYPE html>
      <html>
        <head>
          <link rel="stylesheet" href="style.css">
        </head>
        <body>
        <script type="module" src="bundle.js"></script>
          <div id="root">${app}</div>
        </body>
      </html>`;
      ctx.response.body = html;
  });

  // @ts-ignore
  const { files } = await Deno.emit('./client/index.tsx', {
    bundle: 'esm',
    compilerOptions: {
      jsx: 'react',
      jsxFactory: 'h',
      jsxFragmentFactory: 'Fragment'
    }
  });

  router.get('/bundle.js', (ctx) => {
    ctx.response.headers.set('Content-Type', 'application/javascript');
    ctx.response.body = files['deno:///bundle.js'];
  });

  // Error handling
  app.use(async (ctx: any, next: any) => {
    try {
      return await next();
    } catch (err) {
      ctx.response.body = {
        success: false,
        message: 'Something went wrong.'
      };
      console.log(err);
    }
  });

  app.use(async (ctx: any, next: any) => {
    ctx.state.apiRouter = apiRouter;
    ctx.state.controller = controller;
    return await next();
  });

  // Initialie api router
  const result = await runQuery(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name != 'pg_stat_statements'
  `);
  const tables = result.rows.map((tableArr: any) => tableArr.table_name);

  tables.forEach((collectionName: string) => {
    apiRouter.use(`/${collectionName}`, async (ctx: any, next: any) => {
      ctx.state.collectionName = collectionName;
      return await next();
    });

    apiRouter.get(`/${collectionName}`, defaultController.getAll);
    apiRouter.get(`/${collectionName}/:id`, defaultController.getOne);
    apiRouter.post(`/${collectionName}`, defaultController.create);
    apiRouter.put(`/${collectionName}/:id`, defaultController.update);
    apiRouter.delete(`/${collectionName}/:id`, defaultController.delete);
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use(apiRouter.routes());
  app.use(apiRouter.allowedMethods());

  app.use(tableRouter.routes());
  app.use(tableRouter.allowedMethods());

  app.use(async (ctx: any, next: any) => {
    const root = `${Deno.cwd()}/client/static`
    try {
      await ctx.send({ root });
    } catch {
      next();
    }
  });

  app.addEventListener('listen', () => {
    console.log(`Listening on port ${port}.`);
  });
  // await app.listen({ port: PORT, signal });
};



export default init;