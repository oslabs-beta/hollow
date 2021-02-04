import { ensureDir } from '../../deps.ts';
import routerTemplate from '../templates/routerTemplate.ts';

const routerController: any = {};

routerController.createRouter = async (ctx: any, next: any) => {
  await ensureDir('./api/routes');
  await Deno.writeTextFile(
    `./api/routes/${ctx.state.collectionName}.ts`,
    routerTemplate(ctx.state.collectionName)
  );

  return next();
};

routerController.deleteRouter = async (ctx: any, next: any) => {
  try {
    await Deno.remove(`./api/routes/${ctx.params.name}.ts`);
  }
  catch(err) {}
  
  return next();
};

export default routerController;
