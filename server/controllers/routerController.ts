import { ensureDir } from 'https://deno.land/std@0.85.0/fs/mod.ts';
import routerTemplate from '../templates/routerTemplate.ts';

const routerController: any = {};

routerController.createRouter = async (ctx: any, next: Function) => {
  await ensureDir('./api/routes');
  await Deno.writeTextFile(
    `./api/routes/${ctx.state.collectionName}.ts`,
    routerTemplate(ctx.state.collectionName)
  );

  return await next();
};

routerController.deleteRouter = async (ctx: any, next: Function) => {
  try {
    await Deno.remove(`./api/routes/${ctx.params.name}.ts`);
  }
  catch(err) {}

  return await next();
};

export default routerController;
