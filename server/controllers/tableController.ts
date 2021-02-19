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
    throw err;
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
    throw err;
  }
};

tableController.createTable = async (ctx: any, next: Function) => {
  if (!ctx.request.hasBody) {
    throw new Error('No data');
  }

  const { value } = await ctx.request.body({ type: 'json' });
  const { collectionName, columns } = await value;

  // Check collection name for invalid characters or no collection name
  if (/[^a-z0-9-]/.test(collectionName) || !collectionName.length) {
    throw new Error('Invalid data');
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
    if (
      /[^a-zA-Z0-9_]/.test(columnName) ||
      ['text', 'number', 'boolean'].indexOf(dataType) === -1
    ) {
      throw new Error('Invalid data.');
    }
  }

  let columnInfo = '';
  columns.forEach(
    (
      { columnName, dataType }: { columnName: string; dataType: string },
      index: number
    ) => {
      columnInfo += `${columnName} `;
      switch (dataType) {
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
    }
  );

  const text = `CREATE TABLE ${collectionName} (id SERIAL PRIMARY KEY, ${columnInfo})`;

  try {
    const result = await runQuery(text);

    ctx.state.collectionName = collectionName;
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.deleteTableByName = async (ctx: any, next: Function) => {
  const text = `DROP TABLE ${ctx.params.name}`;

  try {
    await runQuery(text);

    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.renameTable = async (ctx: any, next: any) => {
  const table = ctx.params.name;
  const { value } = await ctx.request.body();
  const newName: string = Object.values(await value).toString();
  const text = `ALTER TABLE IF EXISTS ${table} RENAME TO ${newName};`;

  try {
    const result = await runQuery(text);
    console.log({ result });
    ctx.state.collectionName = table;
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.addColumn = async (ctx: any, next: any) => {
  const table = ctx.params.name;
  const { value } = await ctx.request.body();
  const dataType: any = Object.keys(await value).toString();
  const newColumn: string = Object.values(await value).toString();
  const text = `ALTER TABLE ${table} ADD COLUMN ${newColumn} ${dataType};`;
  //query if more than one column is added at a time
  //const dataType: any = Object.keys(await value).toString();
  //const newColumn: string = Object.values(await value).toString();
  //let newCol: string = 'ADD COLUMN ';
  //for(let i = 0; i < newColumn.length; i++){
  // i === newColumn.length-1 ? newCol += `${newColumn[i]} ${dataType[i]}`: newCol += `${newColumn[i]} ${dataType[i]}, `;
  // }
  //const text: string = `ALTER TABLE ${table} ${newCol};`

  try {
    const result = await runQuery(text);
    ctx.state.row = result.rows[0];
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.deleteColumn = async (ctx: any, next: any) => {
  const table = ctx.params.name;
  const { value } = await ctx.request.body();
  const delColumn: string = Object.values(await value).toString();

  //query if more than one column is deleted at a time
  //const delColumnsArray: string = Object.values(await value)
  //let queryString: string = 'DROP COLUMN IF EXISTS';
  //for(let i = 0; i < delColumnsArray.length; i++){
  // i === delColumnsArray.length-1 ? queryString += `${delColumnsArray[i]}`: queryString += `${delColumnsArray[i]}, `;
  // }
  //const text: string = `ALTER TABLE ${table} ${queryString};`
  const text = `ALTER TABLE ${table} DROP COLUMN IF EXISTS ${delColumn};`;

  try {
    const result = await runQuery(text);
    ctx.state.row = result.rows[0];
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.renameColumn = async (ctx: any, next: any) => {
  const table = ctx.params.name;
  const { value } = await ctx.request.body();

  const newColumnName: any = Object.values(await value).toString();

  const text = `ALTER TABLE ${table} RENAME COLUMN ${ctx.params.fieldName} TO ${newColumnName};`;

  //query rename more than one column at a time
  //const oldColumn: [] = Object.values(await value)
  //const newColumn: [] = Object.values(await value);
  //let text = '';
  // for(let i = 0; i < newColumn.length; i++){
  //   text += `ALTER TABLE ${table} RENAME COLUMN ${oldColumn[i]} TO ${newColumn[i]}; `;
  //
  try {
    const result = await runQuery(text);

    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.getRow = async (ctx: any, next: any) => {
  const table = ctx.params.name;
  // testing text search
  const text = `SELECT title FROM breweries WHERE to_tsvector(name) @@ to_tsquery('keith');`;

  // const text = `SELECT * FROM ${table} WHERE id = ${ctx.params.id};`;

  try {
    const result = await runQuery(text);

    ctx.state.row = result.rows[0];
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.createRow = async (ctx: any, next: any) => {
  const table = ctx.params.name;

  const { value } = await ctx.request.body({ type: 'json' });
  const entries = Object.entries(await value);

  const bodyKeys: string[] = Object.keys(await value);
  const bodyVals: string[] = Object.values(await value);

  let insert = '';
  for (let i = 0; i < entries.length; i++) {
    insert += bodyKeys[i];
    if (i < entries.length - 1) insert += ', ';
  }

  let values = '';
  for (let i = 0; i < entries.length; i++) {
    values += `$${i + 1}`;
    if (i < entries.length - 1) values += ', ';
  }

  const text = `INSERT INTO ${table} (${insert}) VALUES (${values}) RETURNING *;`;
  console.log({ text });
  console.log({ bodyVals });
  console.log({ entries });
  try {
    const result = await runQuery(text, bodyVals);
    ctx.state.row = result.rows[0];
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.updateRow = async (ctx: any, next: any) => {
  if (!ctx.request.hasBody) {
    ctx.response.status = 400;
    ctx.response.body = {
      success: false,
      msg: 'No data included',
    };
    return;
  }

  const table = ctx.params.name;

  const { value } = await ctx.request.body({ type: 'json' });
  const entries = Object.entries(await value);

  const bodyKeys: string[] = Object.keys(await value);
  const bodyVals: string[] = Object.values(await value);

  let set = '';
  for (let i = 0; i < entries.length; i++) {
    set += `${bodyKeys[i]} = $${i + 1}`;
    if (i < entries.length - 1) set += ', ';
  }

  const text = `UPDATE ${table} SET ${set} WHERE id = ${ctx.params.id} RETURNING *;`;

  try {
    const result = await runQuery(text, bodyVals);
    ctx.state.row = result.rows[0];
    return await next();
  } catch (err) {
    throw err;
  }
};

tableController.deleteRow = async (ctx: any, next: any) => {
  const table = ctx.params.name;
  const text = `DELETE FROM ${table} WHERE id = ${ctx.params.id};`;

  try {
    const result = await runQuery(text);
    return await next();
  } catch (err) {
    throw err;
  }
};

export default tableController;
