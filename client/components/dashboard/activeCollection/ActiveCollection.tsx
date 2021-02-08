// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import { ActiveCollectionProps, EntryProps, FieldProps } from './interface.ts';

/**
 * @description Renders Field names for active collection (table headers)
 * @param fieldName - individual field name from active collection
 */
const Field: React.FC<FieldProps> = ({ fieldName, activeCollection }) => {
  return (
    <>
      <th 
        key={`${activeCollection}-${fieldName}`}
        scope='col'
        className='activeCollectionFieldName'
      >
        {fieldName}
      </th>
    </>
  );
};

/**
 * @description Renders entry for active collection
 * @param values - array of values for current entry
 * @param index - index determines background color of table row
 * @param fieldNames - field name for each value; used to give each value a unique key
 */
const Entry: React.FC<EntryProps> = ({ values, index, fieldNames }) => {
  const row = values.map((value, index) => <td key={`${fieldNames[index]}-${value}-${index}`}>{value}</td>)
  return (
    <>
      {index % 2 === 0
        ? (<tr className='activeCollectionEntry backgroundA'>
            {row}
          </tr>)
        : (<tr className='activeCollectionEntry backgroundB'>
            {row}
          </tr>)
      }
    </>
  );
};

/**
 * @description Renders all details for active collection; Gives option to add new entry, delete entry & edit values of entry
 * @param activeCollection - currently selected collection from sidebar
 */
const ActiveCollection: React.FC<ActiveCollectionProps> = ({ activeCollection }) => {
  // TODO:
  // Fix up styling / responsiveness
  // handleClick of individual entry - redirects to entry page where you can edit
  // add delete button to end of each row - handleClick and delete entry from db
  // handle requests for collection data from api
  // add functionality to pagination
  // add results per page


  // Dummy data for testing purposes
  // Will probably make request to api here to get active collection details/entries
  const dummyFields = ['Id', 'Username', 'Email', 'Password'];
  const fields = dummyFields.map(field => <Field activeCollection={activeCollection} fieldName={field} />)

  const dummyEntries = [['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95']];
  const entries = dummyEntries.map((entryArr, index) => (
    <Entry 
      values={entryArr}
      index={index}
      fieldNames={dummyFields} 
    />
  ));

  const entriesCount = dummyEntries.length;

  return (
    <div className='activeCollectionContainer'>
      <div className='activeCollectionHeader'>
        <div className='activeCollectionDetails'>
          <p className='activeCollectionName'>{activeCollection}</p>
          <p className='activeCollectionCount'>{entriesCount} entries found</p>
        </div>
        <button className='addEntryBtn'>Add New {activeCollection}</button>
      </div>
      <div className='activeTableContainer'>
        <table className='activeCollectionTable'>
          <thead>
            <tr>
              {fields}
            </tr>
          </thead>
          <tbody>
            {entries}
          </tbody>
        </table>
      </div>
      <div className='paginationContainer'>
        <div className="pagination">
          <a className='collectionsPaginationLeft' href="#" >&laquo;</a>
          <a className='collectionCurrentPage' href="#">1</a>
          <a className='collectionStalePage' href="#">2</a>
          <a className='collectionStalePage' href="#">3</a>
          <a className='collectionStalePage' href="#">4</a>
          <a className='collectionStalePage' href="#">5</a>
          <a className='collectionStalePage' href="#">6</a>
          <a className='collectionsPaginationRight' href="#">&raquo;</a>
        </div>
      </div>
    </div>
  );
};

export default ActiveCollection;