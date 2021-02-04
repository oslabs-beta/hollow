import db from '../secret.ts';

const tableController: any = {};

tableController.getAllTables = async (ctx: any) => {
  const text = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name != 'pg_stat_statements'
    ORDER BY table_name
  `;

  try {
    await db.connect();
    const result = await db.queryArray(text);
    const tables = result.rows.map((tableArr: any) => tableArr[0]);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: tables
    };
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
  finally {
    await db.end();
  }
}

tableController.getTableByName = async (ctx: any) => {
  const rowText = `SELECT * FROM ${ctx.params.name}`;

  const columnText = `
    SELECT column_name, data_type 
    FROM information_schema.columns
    WHERE table_name = $1
    ORDER BY ordinal_position
  `;

  try {
    await db.connect();
    const rowResult = await db.queryObject(rowText);
    const rows = rowResult.rows;

    const columnResult = await db.queryObject(columnText, ctx.params.name);
    const columns = columnResult.rows;

    ctx.response.status = 200;
    ctx.response.body = {
      success: true,
      data: { rows, columns }
    };
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
  finally {
    await db.end();
  }
}

tableController.createTable = async (ctx: any) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      message: 'No data'
    }
    return;
  }

  const { value } = await ctx.request.body({ type: 'json' });
  const { tableName, columns } = await value;

  let columnInfo = '';
  columns.forEach(({ columnName, dataType }: { columnName: string, dataType: string }, index: number) => {
    columnInfo += `${columnName} ${dataType}`;
    if (index !== columns.length - 1) columnInfo += ', ';
  });
  
  const text = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, ${columnInfo})`;

  try {
    await db.connect();
    const result = await db.queryObject(text);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true
    };
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
  finally {
    await db.end();
  }
};

tableController.deleteTableByName = async (ctx: any) => {
  const text = `DROP TABLE ${ctx.params.name}`;

  try {
    await db.connect();
    await db.queryObject(text);

    ctx.response.status = 200;
    ctx.response.body = {
      success: true
    };
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
  finally {
    await db.end();
  }
};

export default tableController;
