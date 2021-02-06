import { Application, Router, React, ReactDOMServer } from '../deps.ts';
import tableController from './controllers/tableController.ts';
import App from '../client/components/App.tsx';


const router = new Router();

let files: any;

async function bundle() {
  // @ts-ignore
files = await Deno.emit('./client/index.tsx', {
  bundle: 'esm',
  compilerOptions: { // experimenting with these options, don't know if they're making a difference 
    module: 'es6',
    target: 'es2018'
  }
});
}

bundle();

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
          <div id="root">${app}</div>
          <script src="static/client.js" defer></script>
        </body>
      </html>`;
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

router.get('/static/client.js', (ctx) => {
  console.log('bundle!');
  ctx.response.headers.set('Content-Type', 'text/html');
  ctx.response.body = files['deno:///bundle.js'];
});


app.use(async (ctx, next) => {
  const root = `${Deno.cwd()}/client/static`
  try {
    await ctx.send({ root });
  } catch {
    next();
  }
});

app.listen({ port: 8000 });
