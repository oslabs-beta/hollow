import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router.get('/', (ctx: any) => {
  ctx.response.body = { message: 'Hello Deno!' };
  ctx.response.status = 200;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

export default app;

