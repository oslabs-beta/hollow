import { Application } from '../deps.ts';
const app = new Application();

const PORT = 3000;
const routers: any = {};

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

app.addEventListener('listen', () => {
  console.log(`Listening on port ${PORT}.`);
});

await app.listen({ port: PORT });