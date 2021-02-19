import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';

/**
 * @description Renders entry for active collection
 * @param values - array of values for current entry
 * @param index - index determines background color of table row
 * @param fieldNames - field name for each value; used to give each value a unique key
 */

 interface EntryProps {
  values: string[];
  index: number;
  handleFieldClick: (event: any) => void;
 }

export const Entry = ({ values, index, handleFieldClick}: EntryProps) => {
  const row = values.map((value, i) => <td id='field'>{value}</td>)
  return (
    <>
      {index % 2 === 0
        ? (<tr onClick={handleFieldClick} className='activeCollectionEntry backgroundA'>
            {row}
          </tr>)
        : (<tr onClick={handleFieldClick} className='activeCollectionEntry backgroundB'>
            {row}
          </tr>)
      }
    </>
  );
};