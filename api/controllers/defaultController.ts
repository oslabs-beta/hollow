// Placeholder, will swap out
import db from '../../server/secret.ts';

export const getAll = async (ctx: any) => {
  const table = ctx.state.collectionName;
  const text = `SELECT * FROM ${table} ORDER BY id ASC`;

  try {
    await db.connect();
    const result = await db.queryObject(text);
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: `Nothing found in ${table}. Error: ${err}`,
    };
  }
};

export const getOne = async (ctx: any) => {
  const table = ctx.state.collectionName;
  const text = `SELECT * FROM ${table} WHERE id = $1`;
  console.log(ctx.params.id);
  //   PREPARE errthing AS SELECT * FROM  table
  //   `PREPARE foo(text,text,text) AS
  //     SELECT  *
  //     FROM    foobar
  //     WHERE   foo = $1
  //        AND  bar = $2
  //         OR  baz = $3`  ;
  // EXECUTE foo('foo','bar','baz');

  try {
    await db.connect();
    const result = await db.queryObject(text, ctx.params.id);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log('err: ', err);
  } finally {
    await db.end();
  }
};

export const create = async (ctx: any) => {
  const table = ctx.state.collectionName;
  const { value } = await ctx.request.body({ type: 'json' });
  const { name } = await value;
  const text = `INSERT INTO ${table} ( name) VALUES ($1) RETURNING *`;

  try {
    await db.connect();
    const result = await db.queryObject(text, name);
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.log('err: ', err);
  } finally {
    await db.end();
  }
};

export const update = async (ctx: any) => {
  const table = ctx.state.collectionName;
  if (ctx.response.status === 400) {
    ctx.response.body = {
      success: false,
      message: ctx.response.body.message,
    };
    ctx.response.status = 404;
    return;
  } else {
    const { value } = await ctx.request.body({ type: 'json' });
    const { name } = await value;

    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: 'No data included',
      };
    } else {
      try {
        console.log('inside UPDATE');
        await db.connect();
        const result = await db.queryObject(
          `UPDATE ${table} SET name = $1 WHERE id = $2 RETURNING *`,
          name,
          ctx.params.id
        );
        ctx.response.status = 200;
        ctx.response.body = {
          success: true,
          data: result.rows,
        };
      } catch (err) {
        ctx.response.status = 500;
        ctx.response.body = {
          success: false,
          message: err.toString(),
        };
      } finally {
        await db.end();
      }
    }
  }
};

export const deleteOne = async (ctx: any) => {
  const table = ctx.state.collectionName;
  const text = `DELETE FROM ${table} WHERE id = $1`;
  try {
    await db.connect();
    const result = await db.queryObject(text, ctx.params.id);
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.log('err: ', err);
  } finally {
    await db.end();
  }
};
