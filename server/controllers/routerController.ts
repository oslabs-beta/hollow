// import startServer from '../startServer.tsx';
import { Application } from 'https://deno.land/x/oak@v6.5.0/mod.ts';

import { Router } from 'https://deno.land/x/oak@v6.5.0/mod.ts';
import { ensureDir } from '../../deps.ts';

import defaultController from './defaultController.ts';
import routerTemplate from '../templates/routerTemplate.ts';

import { runQuery } from '../secret.ts';

import Dex from 'https://raw.githubusercontent.com/denjucks/dex/master/mod.ts';
const dex = Dex({client: 'postgres'});

const routerController: any = {};

routerController.createRouter = async (ctx: any, next: Function) => {
  await ensureDir('./api/routes');
  await Deno.writeTextFile(
    `./api/routes/${ctx.state.collectionName}.ts`,
    routerTemplate(ctx.state.collectionName)
  );

  return await next();
};

routerController.registerRoutes = async (ctx: any, next: Function) => {
  const apiRouter = ctx.state.apiRouter;
  const collectionName = ctx.state.collectionName;

  apiRouter.use(`/${collectionName}`, async (ctx: any, next: any) => {
    ctx.state.collectionName = collectionName;
    return await next();
  });

  apiRouter.get(`/${collectionName}`, defaultController.getAll);
  apiRouter.get(`/${collectionName}/:id`, defaultController.getOne);
  apiRouter.post(`/${collectionName}`, defaultController.create);
  apiRouter.put(`/${collectionName}/:id`, defaultController.update);
  apiRouter.delete(`/${collectionName}/:id`, defaultController.delete);

  ctx.app.use(apiRouter.routes());
  ctx.app.use(apiRouter.allowedMethods());

  return await next();
};

routerController.deleteRouter = async (ctx: any, next: Function) => {
  try {
    await Deno.remove(`./api/routes/${ctx.params.name}.ts`);
  }
  catch(err) {}
  
  return await next();
};

routerController.deregisterRoutes = async (ctx: any, next: Function) => {
  // const restartServer = await import '../server.tsx';

  // const app = new Application();
  // const controller = new AbortController();
  // const { signal } = controller;
  
  // const PORT = 3000;
  
  // await startServer(app, controller, PORT);
  // await ctx.state.controller.abort();
  // console.log('server closed');

  // await app.listen({ port: PORT, signal });

  // const event = new CustomEvent('restart');
  // globalThis.dispatchEvent(event);

  return await next();
}

export default routerController;
