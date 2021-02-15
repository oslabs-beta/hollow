import { runQuery } from '../../server/secret.ts';

export const getAll = async (ctx: any) => {
  const table = ctx.state.collectionName;

  const text = `SELECT * FROM ${table} ORDER BY id ASC;`;

  try {
    const result = await runQuery(text);
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
  const text = `SELECT * FROM ${table} WHERE id = $1;`;

  try {
    const result = await runQuery(text, ctx.params.id);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows[0],
    };
  } catch (err) {
    console.log('err: ', err);
  }
};

export const create = async (ctx: any) => {
  const table = ctx.state.collectionName;
  const { value } = await ctx.request.body({ type: 'json' });

  const entries = Object.entries(await value);

  const requestKeys: string[] = Object.keys(await value);
  const requestVals: string[] = Object.values(await value);
  let insert = '';

  const arrLength = entries.length;
  for (let i = 0; i < arrLength; i++) {
    if (i === arrLength - 1) insert += `${requestKeys[i]}`;
    else insert += `${requestKeys[i]}, `;
  }
  const fieldArray = requestVals.map((val) => val);

  let values = '';
  for (let i = 0; i < arrLength; i++) {
    if (i === arrLength - 1) {
      values += `$${i + 1} `;
    } else {
      values += `$${i + 1}, `;
    }
  }

  const next = `INSERT INTO ${table} (${insert}) VALUES(${values}) RETURNING *;`;

  try {
    const result = await runQuery(next, requestVals);
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.log('err: ', err);
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

    const entries = Object.entries(await value);

    const requestKeys: string[] = Object.keys(await value);
    const paramVals: string[] = Object.values(await value);
    let set = 'SET ';
    const arrLength = entries.length;
    for (let i = 0; i < arrLength; i++) {
      if (i === arrLength - 1) {
        set += `${requestKeys[i]} = $${i + 1} `;
      } else {
        set += `${requestKeys[i]} = $${i + 1}, `;
      }
    }

    const last = entries.length + 1;
    const next = `UPDATE ${table} ${set} WHERE id = $${last} RETURNING *;`;
    paramVals.push(ctx.params.id);

    if (!ctx.request.hasBody) {
      ctx.response.status = 400;
      ctx.response.body = {
        success: false,
        msg: 'No data included',
      };
    } else {
      try {
        const result = await runQuery(next, paramVals);
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
      }
    }
  }
};

export const deleteOne = async (ctx: any) => {
  const table = ctx.state.collectionName;
  const text = `DELETE FROM ${table} WHERE id = $1;`;
  try {
    const result = await runQuery(text, ctx.params.id);
    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: result.rows,
    };
  } catch (err) {
    console.log('err: ', err);
  }
};
