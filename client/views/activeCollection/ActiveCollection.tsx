// import preact
import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

// import components
import FieldView from '../fieldView/FieldView.tsx';
import * as helpers from './helpers.tsx';

// import type definitions
import { ActiveCollectionProps } from './interface.ts';

/******************************************************************************************* */

/**
 * @description This component renders all details for the active collection.
 * Gives option to add new entry, delete entry & edit values of entry.
 * 
 * @param activeCollection - currently selected collection from sidebar (string)
 * 
 * @param refreshCollections - a function which refreshes the active collections
 * by making a new request to api. Forces any newly added or edited entries to display
 * 
 * @param resultsView - a boolean which determines whether all of the entries in a collection
 * should be displayed or just an individual entry
 * 
 * @param handleResultsView -a function for setting the resultsView depending on wether it is
 * invoked with true or false
 */

const ActiveCollection = ({
  activeCollection,
  refreshCollections,
  resultsView,
  handleResultsView
}: ActiveCollectionProps) => {

  // holds the current page the user is on, defaults to 1
  const [activePage, setActivePage] = useState('1');

  // holds the selected number of results to display per page - options are 10, 20, 50
  const [activeResultsPerPage, setActiveResultsPerPage] = useState('10');

  // holds array of arrays, where each nested array holds two elements,
  // the first element being the field name, and the second
  // element being the data type tied to the field
  const [headers, setHeaders] = useState([[]]);

  // holds an array containing all the entries in the selected collection
  const [entries, setEntries] = useState([]);

  // an object containing the data for the selected entry
  const [activeEntry, setActiveEntry] = useState({});

  // a boolean representing whether or not this is a new entry being created or
  // an active entry being edited/updated
  const [newEntry, setNewEntry] = useState(false);

  // a boolean which determines the state of the confirm delete popup
  // open (true) or closed (false) - defaults to false
  const [deletePopup, setDeletePopup] = useState(false);

  // holds state of api request for updating or adding new entry
  const [saveFail, setSaveFail] = useState(false);

  // holds state of api request for updating or adding new entry
  const [saveSuccess, setSaveSuccess] = useState(false);

  // holds state of api request for updating or adding new entry
  const [loading, setLoading] = useState(false);


  /******************************************************************************************* */

  // invoked when updates to resultsView are recognized
  // a request is made to get all entries in the selected collection
  // and headers and entries arrays are updated with the response data
  //
  // activePage is reset to '1' - the default and handleResultsView 
  // is invoked with true, updating resultsView and
  // telling the application to display all collection results

  useEffect(() => {
    fetch(`/api/tables/${activeCollection}`)
    .then((data) => data.json())
    .then((res) => {
      // console.log('res.data.columns: ', res.data.rows)
      const headers = res.data.columns.map(
        (header: any) => [header.column_name, header.data_type]
      );
      const entries = res.data.rows;

      setActivePage('1');
      setHeaders(headers);
      setEntries(entries);
    })
    .catch((error) => console.log('error', error));
  }, [resultsView]);

  // invoked when updates to activeCollection are recognized
  // a request is made to get all entries in the selected collection
  // and headers and entries arrays are updated with the response data
  //
  // activePage is reset to '1' - the default and handleResultsView 
  // is invoked with true, updating resultsView and
  // telling the application to display all collection results

  useEffect(() => {
    if (activeCollection === undefined) return;
    fetch(`/api/tables/${activeCollection}`)
      .then((data) => data.json())
      .then((res) => {
        // console.log('res.data.columns: ', res.data.rows)
        const headers = res.data.columns.map(
          (header: any) => [header.column_name, header.data_type]
        );
        const entries = res.data.rows;

        setActivePage('1');
        handleResultsView(true);
        setHeaders(headers);
        setEntries(entries);
      })
      .catch((error) => console.log('error', error));
  }, [activeCollection]);

  // updates state variables on click of add new entry button
  const createEntry = (e: any) => {

    const entry: any = {};

    headers.forEach((header: Array<string>) => {

      // this creates a property on entry object, 
      // with key being the header (field name), and 
      // value being an array containing three elements [input value, data type, error message]
      // input and error message start as empty strings because they will be updated and held in state
      // when user changes the input fields in field view

      entry[header[0]] = ['', header[1], ''];
    });

    setActiveEntry(entry);

    // tells application that a new entry is being created here
    setNewEntry(true);

    // tells application that the individual field view should be displayed
    handleResultsView(false);
  };

  // function which updates state variables when an entry is selected
  // to be edited
  const updateEntry = (e: any) => {
    const data: any = {};
    const length = e.target.parentNode.children.length;
    let count = 0;
    while (count < length) {
      const value = e.target.parentNode.children[count].textContent;

      // this creates a property on data object, 
      // with key being the header (field name), and 
      // value being an array containing three elements [input value, data type, error message]
      // error message starts as empty strings because it will be updated and held in state when
      // an error is recognized in the input field.

      data[headers[count][0]] = [value, headers[count][1], ''];
      count += 1;
    }
    setActiveEntry(data);
    setNewEntry(false);
    handleResultsView(false);
  };

  // handles click to a different page
  const handlePageClick = (event: any) => {

    const text = event.target.innerText;

    switch (text) {
      // handle back arrow clicks
      case '«':
        if (activePage === '1') break;
        const leftNum = String(Number(activePage) - 1);
        setActivePage(leftNum);
        break;
      // handle forward arrow clicks
      case '»':
        const pageCount = Math.ceil(
          entries.length / Number(activeResultsPerPage)
        );
        if (Number(activePage) === pageCount) break;
        const rightNum = String(Number(activePage) + 1);
        setActivePage(rightNum);
        break;
      default:
        setActivePage(text);
        break;
    }
  };

  // function which handles click to set the amount of results shown per page

  const handleResultsPerPageClick = (event: any) => {
    const text = event.target.innerText;
    setActivePage('1');
    setActiveResultsPerPage(text);
  };

  // function which renders the confirm delete popup which displays when a user
  // clicks the delete button, and allows user to confirm or cancel the request 
  // to delete the active collection

  const ConfirmDelete = () => {

    // declare variable which will hold the correct loading svg to render based on loading state
  let loader;

  // if loading is true set loader to loading spinner
  if (loading) {
    loader = <div className='saveFieldBtnLoader deletePopupBtnLoader'></div>;

    // if saveFail is true, set loader to failed svg x
  } else if (saveFail) {
    loader = (
      <div>
        <svg 
          className='saveFieldFailSVG deletePopupBtnLoader' 
          xmlns="http://www.w3.org/2000/svg" 
          width="15" 
          height="15" 
          viewBox="0 0 24 24"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
        </svg>
      </div>
    );

    // if saveSuccess is true, set loader to success svg checkmark
  } else if (saveSuccess) {
    loader = (
        <svg 
          className='saveFieldSuccessSVG deletePopupBtnLoader'
          xmlns="http://www.w3.org/2000/svg" 
          width="15" 
          height="15" 
          viewBox="0 0 24 24"
        >
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
        </svg>
    );
  };
  

    return (
      <div className='confirmDeletePopup'>
        <p className='confirmDeleteText'>
          Are you sure you want to delete 
          <br></br><span className='confirmDeleteHighlight'>{activeCollection} </span> 
           from 
          <span className='confirmDeleteHighlight'> collections</span>
          ?
        </p>
        <div className='confirmDeleteBtnContainer'>
          {loader}
          {(!loading && !saveSuccess && !saveFail)
            && <p className='confirmDeleteCancel' onClick={() => setDeletePopup(false)}>cancel</p>
          }
          <button className='confirmDeleteBtn' onClick={(e: any) => handleDelete(e)}>Delete Table</button>)
        </div>
      </div>
    );
  };

  // function which handles the click of the delete button as well as the confirm
  // button in the confirm delete popup

  const handleDelete = (event: any) => {

    if (!deletePopup) setDeletePopup(true);

    // if the button in the confirm delete popup is clicked,
    // the event target will have a className of 'confirmDelete'
    // and this if statement will pass, making the request to actually
    // delete the collection

    if (event.target.className === 'confirmDeleteBtn') {
      setLoading(true);
      fetch(`/api/tables/${activeCollection}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          const copy = activeCollection;
          setLoading(false);
          setSaveSuccess(true);
          setDeletePopup(false);
          refreshCollections();
        }
      })
      .then(() => setSaveSuccess(false))
      .catch((err) => {
        console.log(err);
        setSaveFail(true);
      });
    }
  };

  // maps each field name to the fields array

  const fields = headers.map((field: any, index: number) => (
    <helpers.Field
      activeCollection={activeCollection}
      fieldName={field[0]}
    />
  ));

  // sets entriesCount based on length of entries

  const entriesCount = entries.length;
  let entriesPerPage;

  // creates object with each page as a key, and each value an array of entries
  // size of array and amount of pages is based on selected results per page

  const pagesCache: any = {};
  if (entries.length) {
    const resultsPerPage: number = Number(activeResultsPerPage);
    let count: number = 0;
    let page: number = 1;
    entries.forEach((entry: any) => {
      if (count === resultsPerPage) {
        page += 1;
        count = 0;
      }
      if (!pagesCache[page]) pagesCache[page.toString()] = [];
      pagesCache[page.toString()].push(Object.values(entry));
      count += 1;
    });
    let keyCount = 0;

    // maps each entry based on selected page and selected page

    entriesPerPage = pagesCache[activePage].map(
      (entry: Array<string>, index: number) => {
        keyCount += 1;
        return (
          <helpers.Entry
            values={entry}
            index={index}
            fieldNames={headers}
            handleClick={updateEntry}
          />
        );
      }
    );
  } else entriesPerPage = [];

  // maps page numbers based on results per page and amount of entries

  const pagination = Object.keys(pagesCache).map((page) => {
    let paginationClass;
    page.toString() === activePage
      ? (paginationClass = 'collectionCurrentPage')
      : (paginationClass = 'collectionStalePage');
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

  

  // if results view is truthy, render view which displays all entries
  // in selected collection

  if (resultsView) {
    return (
      <div className="activeCollectionContainer">
        <div className="activeCollectionHeader">
          <div className="deleteContainer">
            <div className="activeCollectionDetails">
              <p className="activeCollectionName">{activeCollection}</p>
              <p className="activeCollectionCount">
                {entries.length} entries found
              </p>
            </div>
            <div className="deleteEntrySVG" onClick={handleDelete}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#bd5555"
              >
                <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z" />
              </svg>
            </div>
          </div>
          <button
            className="addEntryBtn"
            id="addNewEntryBtn"
            onClick={createEntry}
          >
            Add New {activeCollection}
          </button>
        </div>
        <div className="activeTableContainer">
          {deletePopup
            && <ConfirmDelete />
          }
          <table className="activeCollectionTable">
            <thead>
              <tr>
                {fields}
              </tr>
            </thead>
            <tbody>{entriesPerPage}</tbody>
          </table>
        </div>
        {/* if pagination.length (pagination is an array holding hte amount of pages in a collection)
          * is truthy, display the pagination options on the bottom of view
          * if falsy, display an empty div
        */}
        {pagination.length ? (
          <div className="paginationContainer">
            <div className="pagination">
              <a
                className="collectionsPaginationLeft"
                onClick={(e: any) => handlePageClick(e)}
                href="#"
              >
                &laquo;
              </a>
              {pagination}
              <a
                className="collectionsPaginationRight"
                onClick={(e: any) => handlePageClick(e)}
                href="#"
              >
                &raquo;
              </a>
            </div>
            <div className="resultsPerPage">
              <p
                onClick={(e: any) => handleResultsPerPageClick(e)}
                className={
                  activeResultsPerPage === '10'
                    ? 'activeResultsPerPage'
                    : 'staleResultsPerPage'
                }
              >
                10
              </p>
              <p className="resultsSlash">/</p>
              <p
                onClick={(e: any) => handleResultsPerPageClick(e)}
                className={
                  activeResultsPerPage === '20'
                    ? 'activeResultsPerPage'
                    : 'staleResultsPerPage'
                }
              >
                20
              </p>
              <p className="resultsSlash">/</p>
              <p
                onClick={(e: any) => handleResultsPerPageClick(e)}
                className={
                  activeResultsPerPage === '50'
                    ? 'activeResultsPerPage'
                    : 'staleResultsPerPage'
                }
              >
                50
              </p>
            </div>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
    
    // if resultsView is falsy, render the Field View,
    // which displays the view when an individual field is 
    // selected, or this is a new entry beinf created
  } else {
    return (
      <FieldView
        activeEntry={activeEntry}
        activeItem={activeCollection}
        newEntry={newEntry}
        collectionEntries={entries}
        handleResultsView={handleResultsView}
      />
    );
  }
};

export default ActiveCollection;
