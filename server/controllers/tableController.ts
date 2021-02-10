import { runQuery} from '../secret.ts';

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
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
}

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

    const columnResult = await runQuery(columnText, ctx.params.name);
    ctx.state.columns = columnResult.rows;
    return await next();
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
}

tableController.createTable = async (ctx: any, next: Function) => {
  console.log('inside create table');
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      message: 'No data'
    }
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
  console.log('here');
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
  console.log(text);
  try {
    const result = await runQuery(text);

    ctx.state.collectionName = collectionName;
    return await next();
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
};

tableController.deleteTableByName = async (ctx: any, next: Function) => {
  const text = `DROP TABLE ${ctx.params.name}`;

  try {
    await runQuery(text);

    return await next();
  }
  catch(err) {
    ctx.response.status = 500;
    ctx.response.body = {
      success: false,
      message: err.toString()
    };
  }
};

export default tableController;
