import { Application, Router, React, ReactDOMServer } from '../deps.ts';
import tableController from './controllers/tableController.ts';
import App from '../client/components/App.tsx';

const router = new Router();

router
  .get('/api/tables', tableController.getAllTables)
  .post('/api/tables', tableController.createTable)
  .get('/api/tables/:name', tableController.getTableByName)
  .delete('/api/tables/:name', tableController.deleteTableByName);

router.get('/', (ctx) => {
  const app = (ReactDOMServer as any).renderToString(<App />);
  ctx.response.body =
    `<html>
      <head>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <main id="root">${app}</main>
      </body>
    </html>`;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  const root = `${Deno.cwd()}/client/static`
  try {
    await ctx.send({ root });
  } catch {
    next();
  }
});

await app.listen({ port: 8000 });