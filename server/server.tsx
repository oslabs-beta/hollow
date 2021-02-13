import { Application, Router, isHttpError, Status } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import tableRouter from './routes/tableRouter.ts';

import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { render } from 'https://unpkg.com/preact-render-to-string@5.1.12?module';
import App from '../client/components/App.tsx';

const PORT = 8000;
const router = new Router();

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

const app = new Application();

// Error handling
app.use(async (ctx: any, next: any) => {
  try {
    await next();
  } catch (err) {
    ctx.response.body = {
      success: false,
      message: 'Something went wrong.'
    };
    console.log(err);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(tableRouter.routes());
app.use(tableRouter.allowedMethods());

app.use(async (ctx, next) => {
  const root = `${Deno.cwd()}/client/static`
  try {
    await ctx.send({ root });
  } catch {
    next();
  }
});

app.addEventListener('listen', () => {
  console.log(`Listening on port ${PORT}.`);
});
await app.listen({ port: PORT });
