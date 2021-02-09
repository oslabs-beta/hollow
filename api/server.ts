import { existsSync } from "https://deno.land/std@0.85.0/fs/exists.ts";
import { Application } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
const app = new Application();

const env = Deno.env.toObject();
const PORT = Number(env.PORT) || 3000;

const routers: any = {};

// Do not remove, prevents error if no routers
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url}`);
  return await next();
});

if (existsSync('./api/routes')) {
  for (const dirEntry of Deno.readDirSync('api/routes')) {
    if (dirEntry.name.endsWith('.ts')) {
      // Import route files
      const collectionName = dirEntry.name.slice(0, -3);
      const module = await import('./routes/' + dirEntry.name);
      routers[collectionName] = module.default;

      // Use collection router
      app.use(routers[collectionName].routes());
      app.use(routers[collectionName].allowedMethods());
    }
  }
}

app.addEventListener('listen', () => {
  console.log(`Listening on port ${PORT}.`);
});

await app.listen({ port: PORT });