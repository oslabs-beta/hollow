import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import { ActiveCollectionProps, EntryProps, FieldProps } from './interface.ts';

/**
 * @description Renders Field names for active collection (table headers)
 * @param fieldName - individual field name from active collection
 */
const Field = ({ fieldName, activeCollection }: FieldProps) => {
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
const Entry = ({ values, index, fieldNames, handleClick, activeCollection, entryCount }: EntryProps) => {
  const row = values.map((value, i) => <td id='field' className={fieldNames[i]} key={`${fieldNames[index]}-${value}-${index}`}>{value}</td>)
  return (
    <>
      {index % 2 === 0
        ? (<tr onClick={(e: any) => handleClick(e)} className='activeCollectionEntry backgroundA'>
            {/* <td id='field'>
              <input type='checkbox' id={`${activeCollection}-${entryCount}`} />
              &nbsp;
            </td> */}
            {row}
          </tr>)
        : (<tr onClick={(e: any) => handleClick(e)} className='activeCollectionEntry backgroundB'>
          {/* <td id='field'>
            <input type='checkbox' id={`${activeCollection}-${entryCount}`} />
            &nbsp;
          </td> */}
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
const ActiveCollection = ({ activeCollection, collectionEntries, collectionHeaders, handleClick }: ActiveCollectionProps) => {
  const [activePage, setActivePage] = useState('1');
  const [activeResultsPerPage, setActiveResultsPerPage] = useState('10');

  // TODO:
  // Fix up styling / responsiveness
  // add delete button to end of each row - handleClick and delete entry from db
  // Fix bug: when you are on a page greater than the collection you click on to, it breaks - reset page state on click?

  // handles click of page
  const handlePageClick = (event: any) => {
    // @ts-ignore
    const text = event.target.innerText;

    switch(text) {
      case '«':
        if (activePage === '1') break;
        const leftNum = String(Number(activePage) - 1);
        setActivePage(leftNum);
        break;
      case '»':
        const pageCount = Math.ceil(collectionEntries.length / Number(activeResultsPerPage));
        if (Number(activePage) === pageCount) break;
        const rightNum = String(Number(activePage) + 1);
        setActivePage(rightNum);
        break;
      default:
        setActivePage(text);
        break;
    }
    
  };
  
  // handles click of results per page
  const handleResultsPerPageClick = (event: any) => {
    //@ts-ignore
    const text = event.target.innerText;
    setActivePage('1');
    setActiveResultsPerPage(text);
  };

  // maps each field name
  const fields = collectionHeaders.map(field => <Field activeCollection={activeCollection} fieldName={field} />)

  // sets entriesCount based on length of collectionEntries prop
  const entriesCount = collectionEntries.length;
  let entriesPerPage;
  // creates object with each page as a key, and each value an array of entries
  // size of array and amount of pages is based on selected results per page
  const pagesCache: any = {};
  if (entriesCount) {
    const resultsPerPage: number = Number(activeResultsPerPage);
    let count: number = 0;
    let page: number = 1;
    collectionEntries.forEach(entry => {
      if (count === resultsPerPage) {
        page += 1;
        count = 0;
      }
      if (!pagesCache[page]) pagesCache[page.toString()] = [];
      pagesCache[page.toString()].push(entry);
      count += 1;
  });
  let keyCount = 0;


  // maps each entry based on selected page and selected page
  entriesPerPage = pagesCache[activePage].map((entry:Array<string>, index: number) => {
    keyCount += 1;
    return (
      <Entry
        key={`${activeCollection}-Entry-${index}`}
        values={entry}
        index={index}
        fieldNames={collectionHeaders}
        handleClick={handleClick}
        activeCollection={activeCollection}
        entryCount={keyCount}
      />
    );
  });

 } else entriesPerPage = [];
  

  // maps page numbers based on results per page and amount of entries
  const pagination = Object.keys(pagesCache).map(page => {
    let paginationClass;
    page.toString() === activePage ? paginationClass = 'collectionCurrentPage' : paginationClass = 'collectionStalePage';
    return (
      <a 
        className={paginationClass} 
        onClick={(e: any) => handlePageClick(e)}
        href="#"
      >
        {page}
      </a>
    );
  });
    
  return (
    <div className='activeCollectionContainer'>
      <div className='activeCollectionHeader'>
        <div className='activeCollectionDetails'>
          <p className='activeCollectionName'>{activeCollection}</p>
          <p className='activeCollectionCount'>{entriesCount} entries found</p>
        </div>
        <button className='addEntryBtn' id='addNewEntryBtn' onClick={handleClick} >Add New {activeCollection}</button>
      </div>
      <div className='activeTableContainer'>
        <table className='activeCollectionTable'>
          <thead>
            <tr>
              {/* <th scope='col' className='activeCollectionFieldName'>check</th> */}
              {fields}
            </tr>
          </thead>
          <tbody>
            {entriesPerPage}
          </tbody>
        </table>
      </div>
      {pagination.length  
        ? (<div className='paginationContainer'>
            <div className="pagination">
              <a className='collectionsPaginationLeft' onClick={(e: any) => handlePageClick(e)} href="#" >&laquo;</a>
                {pagination}
              <a className='collectionsPaginationRight' onClick={(e: any) => handlePageClick(e)} href="#">&raquo;</a>            
            </div>
            <div className='resultsPerPage'>
              <p onClick={(e: any) => handleResultsPerPageClick(e)} className={activeResultsPerPage === '10' ? 'activeResultsPerPage' : 'staleResultsPerPage'}>10</p>
              <p className='resultsSlash'>/</p>
              <p onClick={(e: any) => handleResultsPerPageClick(e)} className={activeResultsPerPage === '20' ? 'activeResultsPerPage' : 'staleResultsPerPage'}>20</p>
              <p className='resultsSlash'>/</p>
              <p onClick={(e: any) => handleResultsPerPageClick(e)} className={activeResultsPerPage === '50' ? 'activeResultsPerPage' : 'staleResultsPerPage'}>50</p>
            </div>
          </div>)
        : <div></div>
      }
    </div>
  );
};

export default ActiveCollection;