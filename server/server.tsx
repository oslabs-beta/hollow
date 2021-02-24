import { Application, Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts';

import apiRouter from './routes/apiRouter.ts';
import tableRouter from './routes/tableRouter.ts';

import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { render } from 'https://unpkg.com/preact-render-to-string@5.1.12?module';
import App from '../client/components/App.tsx';

const PORT = 3000;

const init = async (app: any, controller: any) => {
  const router = new Router();
  // let apiRouter = new Router({ prefix: '/api' });

  router.get('/', async (ctx) => {
    const app = render(<App />);
    ctx.response.headers.set('Content-Type', 'text/html');
    const html = 
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Hollow CMS</title>
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
    return await next();
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

  globalThis.addEventListener('restart', restartRouter);

  app.addEventListener('listen', () => {
    console.log(`Listening on port ${PORT}.`);
  });
};

const restartRouter = async () => {
  globalThis.removeEventListener('restart', restartRouter);

  const newApp = new Application();

  const newController = new AbortController();
  const newSignal = newController.signal;

  await init(newApp, newController);

  controller.abort();
  await (globalThis as any).listenPromise;

  (globalThis as any).listenPromise = newApp.listen({ port: PORT, signal: newSignal });
};

const app = new Application;

const controller = new AbortController();
const { signal } = controller;

await init(app, controller);

(globalThis as any).listenPromise = app.listen({ port: PORT, signal });
