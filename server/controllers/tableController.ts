import { runQuery } from '../secret.ts';

const tableController: any = {};

tableController.getAllTables = async (ctx: any, next: Function) => {
  const text = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name != 'pg_stat_statements'
    ORDER BY table_name
  `;

  try {
    const result = await runQuery(text);
    const tables = result.rows.map((tableArr: any) => tableArr.table_name);
    ctx.state.tables = tables;
    return await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString(),
    };
  }
};

tableController.getTableByName = async (ctx: any, next: Function) => {
  const rowText = `SELECT * FROM ${ctx.params.name} ORDER BY id ASC`;

  const columnText = `
    SELECT column_name, data_type 
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `;

  try {
    const rowResult = await runQuery(rowText);

    ctx.state.rows = rowResult.rows;

    const columnResult = await runQuery(columnText, [ctx.params.name]);
    ctx.state.columns = columnResult.rows;
    return await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString(),
    };
  }
};

tableController.createTable = async (ctx: any, next: Function) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      message: 'No data',
    };
    return;
  }

  const { value } = await ctx.request.body({ type: 'json' });
  const { collectionName, columns } = await value;

  // Check collection name for invalid characters or no collection name
  if (/[^a-z0-9-]/.test(collectionName) || !collectionName.length) {
    ctx.response.status = 400;
    return ctx.response.body = {
      success: false,
      message: 'Invalid data'
    }
  }

  // Data validation
  for (let i = columns.length - 1; i >= 0; i--) {
    const { columnName, dataType } = columns[i];

    // Remove columns with no name
    if (!columnName.length) {
      columns.splice(i, 1);
      continue;
    }

    // Check name for invalid characters
    // Check for invalid data types
    if (/[^a-zA-Z0-9_]/.test(columnName) ||
    ['text', 'number', 'boolean'].indexOf(dataType) === -1) {
      ctx.response.status = 400;
      return ctx.response.body = {
        success: false,
        message: 'Invalid data'
      }
    }
  }

  let columnInfo = '';
  columns.forEach(({ columnName, dataType }: { columnName: string, dataType: string }, index: number) => {
    columnInfo += `${columnName} `;
    switch(dataType) {
      case 'text':
        columnInfo += 'VARCHAR';
        break;
      case 'number':
        columnInfo += 'INTEGER';
        break;
      case 'boolean':
        columnInfo += 'BOOLEAN';
        break;
    }

    if (index !== columns.length - 1) columnInfo += ', ';
  });
  
  const text = `CREATE TABLE ${collectionName} (id SERIAL PRIMARY KEY, ${columnInfo})`;

  try {
    const result = await runQuery(text);

    ctx.state.collectionName = collectionName;
    return await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString(),
    };
  }
};

tableController.deleteTableByName = async (ctx: any, next: Function) => {
  const text = `DROP TABLE ${ctx.params.name}`;

  try {
    await runQuery(text);

    return await next();
  } catch (err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString(),
     };
  }
};

tableController.getRow = async (ctx: any) => {
  const table = ctx.params.name;
  const text = `SELECT * FROM ${table} WHERE id = $1;`;
  console.log('ctx params: ', ctx.params);
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

tableController.createRow = async (ctx: any) => {
  const table = ctx.params.name;
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
  console.log({ fieldArray });
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

tableController.updateRow = async (ctx: any) => {
  const table = ctx.params.name;
  // console.log('ctx state: ', ctx.state);
  // console.log('ctx.request', ctx.request);
  console.log('ctx.request.body', ctx.request.body);
  // if (ctx.response.status === 400) {
  //   ctx.response.body = {
  //     success: false,
  //     message: ctx.response.body.message,
  //   };
  //   ctx.response.status = 404;
  //   return;
  // } else
   
    const { value } = await ctx.request.body({ type: 'json' });
    // const { name } = await value;
    const entries = Object.entries(await value);
    console.log('entries: ', entries);
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
    console.log('ctx.params.id: ', ctx.params.id);
    const last = entries.length + 1;
    const next = `UPDATE ${table} ${set} WHERE id = $${last} RETURNING *;`;
    paramVals.push(ctx.params.id);
    console.log({ paramVals });
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
  
};

tableController.deleteRow = async (ctx: any) => {
  const table = ctx.params.name;
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

export default tableController;
