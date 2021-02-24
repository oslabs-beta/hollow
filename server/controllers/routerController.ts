import defaultController from './defaultController.ts';

const routerController: any = {};

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

routerController.deregisterRoutes = async (ctx: any, next: Function) => {
  const event = new CustomEvent('restart');
  globalThis.dispatchEvent(event);

  return await next();
}

export default routerController;
