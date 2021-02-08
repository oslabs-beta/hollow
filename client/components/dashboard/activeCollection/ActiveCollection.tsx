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
class ActiveCollection extends React.Component<ActiveCollectionProps, ActiveCollectionState> {
  constructor(props: ActiveCollectionProps) {
    super(props);
    this.state = { activePage: '1', activeResultsPerPage: '10' };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleResultsPerPageClick = this.handleResultsPerPageClick.bind(this);
  }

  // TODO:
  // Fix up styling / responsiveness
  // handleClick of individual entry - redirects to entry page where you can edit
  // add delete button to end of each row - handleClick and delete entry from db
  // handle requests for collection data from api
  // add functinality for resultsPerPage Arrows
  // fix pagination bugs


  handlePageClick(event: React.MouseEvent) {
    // @ts-ignore
    const text = event.target.innerText;
    this.setState({ activePage: text });
  };
  
  handleResultsPerPageClick(event: React.MouseEvent) {
    //@ts-ignore
    const text = event.target.innerText;
    this.setState({ activeResultsPerPage: text });
  };


  componentDidMount() {

    
      
      
  };


  render () {

    // destructure props
    const { activeCollection, collectionEntries, collectionHeaders } = this.props;

    // Dummy data for testing purposes
    // Will probably make request to api here to get active collection details/entries
    // const dummyFields = ['Id', 'Username', 'Email', 'Password'];
    const fields = collectionHeaders.map(field => <Field activeCollection={activeCollection} fieldName={field} />)

    // const dummyEntries = [['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['2', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['3', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95'], ['1', 'matt', 'matt@matt.com', 'banana95']];
    const entriesCount = collectionEntries.length;

    // render pages for pagination
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

    const entriesPerPage = pagesCache[this.state.activePage].map((entry:Array<string>, index: number) => (
      <Entry
        key={`${activeCollection}-Entry-${index}`}
        values={entry}
        index={index}
        fieldNames={collectionHeaders}
    />));

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