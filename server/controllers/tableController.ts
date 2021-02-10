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
  const rowText = `SELECT * FROM ${ctx.params.name}`;

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
  const { tableName, columns } = await value;

  let columnInfo = '';
  columns.forEach(
    (
      { columnName, dataType }: { columnName: string; dataType: string },
      index: number
    ) => {
      columnInfo += `${columnName} ${dataType}`;
      if (index !== columns.length - 1) columnInfo += ', ';
    }
  );

  const text = `CREATE TABLE ${tableName} (id SERIAL PRIMARY KEY, ${columnInfo})`;

  try {
    const result = await runQuery(text);

    ctx.state.collectionName = tableName;
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

export default tableController;
