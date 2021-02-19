import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import {
  useState,
  useEffect,
} from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import FieldView from '../fieldView/FieldView.tsx';

import { ActiveCollectionProps, EntryProps, FieldProps } from './interface.ts';
import { reset } from 'https://deno.land/std@0.84.0/fmt/colors.ts';

/**
 * @description Renders Field names for active collection (table headers)
 * @param fieldName - individual field name from active collection
 */
const Field = ({ fieldName, activeCollection, index }: FieldProps) => {
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

/**
 * @description Renders entry for active collection
 * @param values - array of values for current entry
 * @param index - index determines background color of table row
 * @param fieldNames - field name for each value; used to give each value a unique key
 */
const Entry = ({
  values,
  index,
  fieldNames,
  handleClick,
  activeCollection,
  entryCount,
}: EntryProps) => {
  const row = values.map((value, i) => (
    <td
      id="field"
      className={fieldNames[i]}
      key={`${fieldNames[index]}-${value}-${index}`}
    >
      {value}
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

/**
 * @description Renders all details for active collection; Gives option to add new entry, delete entry & edit values of entry
 * @param activeCollection - currently selected collection from sidebar
 */
const ActiveCollection = ({
  activeCollection,
  refreshCollections,
}: ActiveCollectionProps) => {
  const [activePage, setActivePage] = useState('1');
  const [activeResultsPerPage, setActiveResultsPerPage] = useState('10');

  const [resultsView, setResultsView] = useState(true);
  const [headers, setHeaders] = useState([]);
  const [entries, setEntries] = useState([]);
  const [activeEntry, setActiveEntry] = useState({});
  const [newEntry, setNewEntry] = useState(false);

  useEffect(() => {
    fetch(`/api/tables/${activeCollection}`)
      .then((data) => data.json())
      .then((res) => {
        const headers = res.data.columns.map(
          (header: any) => header.column_name
        );
        const entries = res.data.rows;

        setActivePage('1');
        setResultsView(true);
        setHeaders(headers);
        setEntries(entries);
      })
      .catch((error) => console.log('error', error));
  }, [activeCollection]);

  // Change for new entry
  const createEntry = (e: any) => {
    const entry: any = {};
    headers.forEach((header: string) => {
      entry[header] = '';
    });

    setActiveEntry(entry);
    setNewEntry(true);
    setResultsView(false);
  };
  const createColumn = (e: any) => {
    const column: any = {};
    headers.forEach((header: string) => {
      column[header] = '';
    });

    setActiveEntry(column);
    setNewEntry(false);
    setResultsView(false);
  };

  const updateEntry = (e: any) => {
    const entryIdx =
      Number(activeResultsPerPage) * (Number(activePage) - 1) +
      Number(e.currentTarget.dataset.idx);
    const targetEntry = entries[entryIdx];

    setActiveEntry(targetEntry);
    setNewEntry(false);
    setResultsView(false);
  };
  // TODO:
  // Fix up styling / responsiveness
  // add delete button to end of each row - handleClick and delete entry from db
  // Fix bug: when you are on a page greater than the collection you click on to, it breaks - reset page state on click?

  // handles click of page
  const handlePageClick = (event: any) => {
    // @ts-ignore
    const text = event.target.innerText;

    switch (text) {
      case '«':
        if (activePage === '1') break;
        const leftNum = String(Number(activePage) - 1);
        setActivePage(leftNum);
        break;
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

  // handles click of results per page
  const handleResultsPerPageClick = (event: any) => {
    //@ts-ignore
    const text = event.target.innerText;
    setActivePage('1');
    setActiveResultsPerPage(text);
  };

  const handleDelete = (event: any) => {
    fetch(`/api/tables/${activeCollection}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          refreshCollections();
        }
      })
      .catch((err) => console.log(err));
  };

  // maps each field name
  const fields = headers.map((field: any, index: number) => (
    <Field
      activeCollection={activeCollection}
      fieldName={field}
      index={index}
    />
  ));

  // sets entriesCount based on length of entries
  const entriesCount = entries.length;
  let entriesPerPage;
  // creates object with each page as a key, and each value an array of entries
  // size of array and amount of pages is based on selected results per page
  const pagesCache: any = {};
  if (entriesCount) {
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
          <Entry
            key={`${activeCollection}-Entry-${index}`}
            values={entry}
            index={index}
            fieldNames={headers}
            handleClick={updateEntry}
            activeCollection={activeCollection}
            entryCount={keyCount}
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

  if (resultsView) {
    return (
      <div className="activeCollectionContainer">
        <div className="activeCollectionHeader">
          <div className="deleteContainer">
            <div className="activeCollectionDetails">
              <p className="activeCollectionName">{activeCollection}</p>
              <p className="activeCollectionCount">
                {entriesCount} entries found
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
          <button
            className="addEntryBtn"
            id="addNewEntryBtn"
            onClick={createColumn}
          >
            Add New Column
          </button>
        </div>
        <div className="activeTableContainer">
          <table className="activeCollectionTable">
            <thead>
              <tr>
                {/* <th scope='col' className='activeCollectionFieldName'>check</th> */}
                {fields}
              </tr>
            </thead>
            <tbody>{entriesPerPage}</tbody>
          </table>
        </div>
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
  } else {
    // return <div></div>
    return (
      <FieldView
        activeEntry={activeEntry}
        activeItem={activeCollection}
        newEntry={newEntry}
        collectionEntries={entries}
      />
    );
  }
};

export default ActiveCollection;
