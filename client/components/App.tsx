import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import Header from './header/Header.tsx';
import Sidebar from './sidebar/Sidebar.tsx';
import ContentBuilder from './dashboard/contentBuilder/ContentBuilder.tsx';
import ActiveCollection from "./dashboard/activeCollection/ActiveCollection.tsx";
import FieldView from './dashboard/fieldView/FieldView.tsx';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

/**
 * @description holds state of app & renders app
 * @state activeItem - stores name of currently selected collection
 * @state view - stores current view (collection, content-builder, plugins, settings)
 * @state collections - stores current collections currently stored in db
 * @state collectionHeaders - stores headers of curenntly selected collection
 * @state collectionEntries - stores array of arrays - each array holds values for a given entry 
 */
const App = () => {
  const [activeItem, setActiveItem] = useState('');
  const [view, setView] = useState('collection');
  const [collections, setCollections] = useState([]);
  const [collectionHeaders, setCollectionHeaders] = useState([]);
  const [collectionEntries, setCollectionEntries] = useState([[]]);
  const [activeEntry, setActiveEntry] = useState({});

  // will need to get current collections from api - these are dummy values for testing
  const currentCollections = collections;
  const currentTools = ['Content-Builder', 'Plugins'];

  // On mount:
  // make a request to api to get all table names (collections) - update state with results
  // make a request to api to get active table entries - update state with results
  useEffect(() => {
    fetch('/api/tables')
      .then(data => data.json())
      .then((data) => {
        setCollections(collections.concat(data.data));
        setActiveItem(data.data[0]);
      })
      .catch(error => console.log('error', error));
  }, []);

  useEffect(() => {
    if (currentTools.indexOf(activeItem) === -1) { // ensures active item is not a tool
      fetch(`/api/tables/${activeItem}`)
        .then(data => data.json())
        .then(data => {
          // map headers for active collection
          const headers = data.data.columns.map((header: any) => header.column_name)
          // map entries for active collection
          const entries = data.data.rows.map((entry:any) => Object.values(entry).map(value => value));
          setCollectionHeaders(headers);
          setCollectionEntries(entries);
        })
        .catch(error => console.log('error', error));
      }
  }, [activeItem]);

  /**
   * @description sets state to active item (collection or tool) on click of sidebar item
   * @param event
   */
  const handleClick = (event: any) => {
    let active;
    // @ts-ignore
    if (event.target.id === 'field') active = 'field';
    // @ts-ignore
    else active = event.target.innerText;
    // Sets correct view based on which item was clicked
    switch(active) {
      case 'field':
        // @ts-ignore
        const valueCount = event.target.parentNode.cells.length;
        let count = 1;
        const entryData: any = {};
        while (count < valueCount) {
          // @ts-ignore
          const field = event.target.parentNode.cells[count].classList;
          // @ts-ignore
          const value = event.target.parentNode.cells[count].innerText;
          entryData[field] = value;
          count += 1;
        }
        setView('field');
        setActiveEntry(entryData);
        break;
      case 'Settings':
        if (view !== 'settings') {
          setActiveItem(active);
          setView('settings');
        }
        break;
      case 'Content-Builder':
        if (view !== 'content-builder') {
          setActiveItem(active);
          setView('content-builder');
        }
        break;
      case 'Plugins':
        if (view !== 'plugins') {
          setActiveItem(active);
          setView('plugins');
        }
        break;

      // default will catch on collection clicks
      // make a request to api to get all table names (collections) - update state with results
      // make a request to api to get active table entries - update state with results
      // set correct view if needed
      default:
        setView('collection');
        setActiveItem(active);
    }
  };

    // stores component to render - based on view in state
    let activeView;
    
    // set view for collection component
    if (view === 'collection') {
      activeView = (
        <ActiveCollection 
          activeCollection={activeItem}
          collectionHeaders={collectionHeaders}
          collectionEntries={collectionEntries}
          handleClick={handleClick}
        />
      );
    } else if (view === 'content-builder') {
      // need to create content builder compononent before assinging to activeView
      activeView = <ContentBuilder />
    } else if (view === 'plugins') {
      // need to create plugins compononent before assinging to activeView - or not. dont really have a use for it atm
      // activeView = <Plugins />
      activeView = <div></div>;
    } else if (view === 'settings') {
      // need to create settings compononent before assinging to activeView
      // activeView = <Settings />
      activeView = <div></div>;
    } else if (view === 'field') {
      activeView = <FieldView activeEntry={activeEntry} activeItem={activeItem} />
    }

  return (
    <div>
      <Header />
      <Sidebar
        activeItem={activeItem}
        currentCollections={currentCollections} 
        currentTools={currentTools} 
        handleClick={handleClick}  
      />
      {activeView}
    </div>
  );
}

export default App;
