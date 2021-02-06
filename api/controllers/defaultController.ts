// Placeholder, will swap out

export const getAll = (ctx: any) => {
  ctx.response.status = 200;
  ctx.response.body = `Get all - ${ctx.state.collectionName}`;
};

export const getOne = (ctx: any) => {
  ctx.response.status = 200;
  ctx.response.body = `Get one - ${ctx.state.collectionName}`;
};

export const create = (ctx: any) => {
  ctx.response.status = 200;
  ctx.response.body = `Create - ${ctx.state.collectionName}`;
};

export const update = (ctx: any) => {
  ctx.response.status = 200;
  ctx.response.body = `Update - ${ctx.state.collectionName}`;
};

export const deleteOne = (ctx: any) => {
  ctx.response.status = 200;
  ctx.response.body = `Delete one - ${ctx.state.collectionName}`;
}