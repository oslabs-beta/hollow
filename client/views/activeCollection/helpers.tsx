// import preact
import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';

// import type definitions
import { FieldProps, EntryProps } from './interface.ts';

/******************************************************************************************* */

/**
 * @description Renders Field names for active collection (table headers)
 * 
 * @param fieldName - individual field name from active collection
 * 
 * @param activeCollection -
 */

export const Field = ({ fieldName, activeCollection }: FieldProps) => {
  return (
    <>
      <th
        key={`${activeCollection}-${fieldName}`}
        scope="col"
        className="activeCollectionFieldName"
      >
        {fieldName}
      </th>
    </>
  );
};

/******************************************************************************************* */

/**
 * @description Renders individual entry's for active collection view
 * 
 * @param values - array of values for current entry
 * 
 * @param index - index determines background color of table row
 * 
 * @param fieldNames - field name for each value; used to give each value a unique key
 * 
 * @param handleClick - function which handles setting the correct view and passing
 * down the correct data when an entry s clicked
 */

export const Entry = ({
  values,
  index,
  fieldNames,
  handleClick,
}: EntryProps) => {
  const row = values.map((value: any, i: number) => (
      <td
        id="field"
        className={fieldNames[i]}
        key={`${fieldNames[index]}-${value}-${index}`}
      >
        {value === null ? 'null' : value.toString()}
      </td>
    ));
  
  return (
    <>
      {index % 2 === 0 ? (
        <tr
          onClick={handleClick}
          data-idx={index}
          className="activeCollectionEntry backgroundA"
        >
          {/* <td id='field'>
              <input type='checkbox' id={`${activeCollection}-${entryCount}`} />
              &nbsp;
            </td> */}
          {row}
        </tr>
      ) : (
        <tr
          onClick={handleClick}
          data-idx={index}
          className="activeCollectionEntry backgroundB"
        >
          {/* <td id='field'>
            <input type='checkbox' id={`${activeCollection}-${entryCount}`} />
            &nbsp;
          </td> */}
          {row}
        </tr>
      )}
    </>
  );
};