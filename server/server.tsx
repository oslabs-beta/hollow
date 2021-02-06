import { Application, Router, React, ReactDOMServer } from '../deps.ts';
import tableRouter from './routes/tableRouter.ts';

import App from '../client/components/App.tsx';

const PORT = 8000;
const router = new Router();

router.get('/', (ctx) => {
  const app = (ReactDOMServer as any).renderToString(<App />);
  ctx.response.body =
    `<html>
      <head>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <main id="root">${app}</main>
        <script src="bundle.js" defer></script>
      </body>
    </html>`;
});

 // @ts-ignore
 const { files } = await Deno.emit('./client/index.tsx', {
  bundle: 'esm',
});



router.get('/static/client.js', (ctx) => {
  console.log('bundle!');
  ctx.response.headers.set('Content-Type', 'text/javascript');
  ctx.response.body = `(async () => { // @ts-ignore ${files['deno:///bundle.js']} })()`
});

const app = new Application();

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

await app.listen({ port: 8000 });
