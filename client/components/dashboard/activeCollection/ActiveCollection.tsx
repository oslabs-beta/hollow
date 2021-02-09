// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

import { ActiveCollectionProps, ActiveCollectionState,EntryProps, FieldProps } from './interface.ts';

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
const Entry: React.FC<EntryProps> = ({ values, index, fieldNames, handleClick, activeCollection, entryCount }) => {
  const row = values.map((value, i) => <td id='field' className={fieldNames[i]} key={`${fieldNames[index]}-${value}-${index}`}>{value}</td>)
  return (
    <>
      {index % 2 === 0
        ? (<tr onClick={(e) => handleClick(e)} className='activeCollectionEntry backgroundA'>
            <td id='field'>
              <input type='checkbox' id={`${activeCollection}-${entryCount}`} />
              &nbsp;
            </td>
            {row}
          </tr>)
        : (<tr onClick={(e) => handleClick(e)} className='activeCollectionEntry backgroundB'>
          <td id='field'>
            <input type='checkbox' id={`${activeCollection}-${entryCount}`} />
            &nbsp;
          </td>
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
class ActiveCollection extends React.Component<ActiveCollectionProps, ActiveCollectionState> {
  constructor(props: ActiveCollectionProps) {
    super(props);
    this.state = { activePage: '1', activeResultsPerPage: '10' };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleResultsPerPageClick = this.handleResultsPerPageClick.bind(this);
  }

  // TODO:
  // Fix up styling / responsiveness
  // add delete button to end of each row - handleClick and delete entry from db
  // Fix bug: when you are on a page greater than the collection you click on to, it breaks - reset page state on click?


  componentWillUnmount() {
    this.setState({ ...this.state, activePage: '1' });
  };


  // handles click of page
  handlePageClick(event: React.MouseEvent) {
    // @ts-ignore
    const text = event.target.innerText;

    switch(text) {
      case '«':
        if (this.state.activePage === '1') break;
        const leftNum = String(Number(this.state.activePage) - 1);
        this.setState({ activePage: leftNum });
        break;
      case '»':
        const pageCount = Math.ceil(this.props.collectionEntries.length / Number(this.state.activeResultsPerPage));
        if (Number(this.state.activePage) === pageCount) break;
        const rightNum = String(Number(this.state.activePage) + 1);
        this.setState({ activePage: rightNum });
        break;
      default:
        this.setState({ activePage: text });
        break;
    }
    
  };
  
  // handles click of results per page
  handleResultsPerPageClick(event: React.MouseEvent) {
    //@ts-ignore
    const text = event.target.innerText;
    this.setState({ activePage: '1', activeResultsPerPage: text });
  };

  render () {
    // destructure props
    const { activeCollection, collectionEntries, collectionHeaders, handleClick } = this.props;

    // maps each field name
    const fields = collectionHeaders.map(field => <Field activeCollection={activeCollection} fieldName={field} />)

    // sets entriesCount based on length of collectionEntries prop
    const entriesCount = collectionEntries.length;

    // creates object with each page as a key, and each value an array of entries
    // size of array and amount of pages is based on selected results per page
    const pagesCache: any = {};
    const resultsPerPage: number = Number(this.state.activeResultsPerPage);
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
    const entriesPerPage = pagesCache[this.state.activePage].map((entry:Array<string>, index: number) => {
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

    // maps page numbers based on results per page and amount of entries
    const pagination = Object.keys(pagesCache).map(page => {
      let paginationClass;
      page.toString() === this.state.activePage ? paginationClass = 'collectionCurrentPage' : paginationClass = 'collectionStalePage';
      return (
        <a 
          className={paginationClass} 
          onClick={(e) => this.handlePageClick(e)} 
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
          <button className='addEntryBtn'>Add New {activeCollection}</button>
        </div>
        <div className='activeTableContainer'>
          <table className='activeCollectionTable'>
            <thead>
              <tr>
                <th scope='col' className='activeCollectionFieldName'>check</th>
                {fields}
              </tr>
            </thead>
            <tbody>
              {entriesPerPage}
            </tbody>
          </table>
        </div>
        <div className='paginationContainer'>
          <div className="pagination">
            <a className='collectionsPaginationLeft' onClick={(e) => this.handlePageClick(e)} href="#" >&laquo;</a>
              {pagination}
            <a className='collectionsPaginationRight' onClick={(e) => this.handlePageClick(e)} href="#">&raquo;</a>            
          </div>
          <div className='resultsPerPage'>
            <p onClick={(e) => this.handleResultsPerPageClick(e)} className={this.state.activeResultsPerPage === '10' ? 'activeResultsPerPage' : 'staleResultsPerPage'}>10</p>
            <p className='resultsSlash'>/</p>
            <p onClick={(e) => this.handleResultsPerPageClick(e)} className={this.state.activeResultsPerPage === '20' ? 'activeResultsPerPage' : 'staleResultsPerPage'}>20</p>
            <p className='resultsSlash'>/</p>
            <p onClick={(e) => this.handleResultsPerPageClick(e)} className={this.state.activeResultsPerPage === '50' ? 'activeResultsPerPage' : 'staleResultsPerPage'}>50</p>
          </div>
        </div>
      </div>
    );
  };
};

export default ActiveCollection;