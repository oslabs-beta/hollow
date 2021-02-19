import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import Header from './header/Header.tsx';
import Sidebar from './sidebar/Sidebar.tsx';
import ContentBuilder from './dashboard/contentBuilder/ContentBuilder.tsx';
import ActiveCollection from "./dashboard/activeCollection/ActiveCollection.tsx";

/**
 * @description holds state of app & renders app
 * @state activeItem - stores name of currently selected collection
 * @state view - stores current view (collection, content-builder, settings)
 * @state collections - stores current collections currently stored in db
 * @state collectionEntries - stores array of arrays - each array holds values for a given entry 
 */
const App = () => {
  const [activeItem, setActiveItem] = useState('');
  const [view, setView] = useState('collection');
  const [collections, setCollections] = useState([]);
  const [scroll, setScroll] = useState(false);

  // will need to get current collections from api - these are dummy values for testing
  const currentCollections = collections;
  const currentTools = ['Content-Builder'];

  const refreshCollections = async () => {
    try {
      const response = await fetch('/api/tables');
      const data = await response.json();

      await setCollections(data.data);

    } catch (err) {
      console.log('err', err);
    };
  }

  // On mount:
  // make a request to api to get all table names (collections) - update state with results
  // make a request to api to get active table entries - update state with results
  // set activeItem as first colelction in response
  useEffect(() => {
    fetch('/api/tables')
    .then(data => data.json())
    .then((data) => {
      setCollections(collections.concat(data.data));

      // If active item is a tool, do not set active item to a collection
      if (currentTools.indexOf(activeItem) === -1) {
        setActiveItem(data.data[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (activeItem !== '' && !collections.includes(activeItem)) {
      setActiveItem(collections[0]);
      setScroll(true);
      // @ts-ignore
      // const toScroll = document.querySelector('collectionItems');
      toScroll.scrollType = '0';
    }
  }, [collections]);


  const handleActiveChange = (item: string) => {
    setActiveItem(item);
    setView('collection');
  };

  /**
   * @description sets state to active item (collection or tool) on click of sidebar item
   * @param event
   */
  const handleClick = (event: any) => {
    let active;
    // @ts-ignore
    if (event.target.id === 'field') active = 'field';
    // @ts-ignore
    else if (event.target.id === 'addNewEntryBtn') active = 'addField';
    // @ts-ignore
    else active = event.target.innerText;
    // Sets correct view based on which item was clicked
    switch(active) {
      case 'Settings': {
        if (view !== 'settings') {
          setActiveItem(active);
          setView('settings');
        }
        break;
      }
      case 'Content-Builder': {
        if (view !== 'content-builder') {
          setActiveItem(active);
          setView('content-builder');
        }
        break;
      }
      // default will catch on collection clicks
      default:
        setView('collection');
        setActiveItem(active);
    }
  };

    // stores component to render - based on view in state
    let activeView;
    
    // set view for collection component
    if (view === 'collection') {
      activeView = <ActiveCollection
        activeCollection={activeItem}
        refreshCollections={refreshCollections}
      />
    } else if (view === 'content-builder') {
      activeView = <ContentBuilder
        refreshCollections={refreshCollections}
        handleActiveChange={handleActiveChange}
        currentCollections={currentCollections}
      />
    } else if (view === 'settings') {
        // need to create settings compononent before assinging to activeView
        // activeView = <Settings />
        activeView = <div></div>;
    }

  return (
    <div className='app'>
      <Header />
      <Sidebar
        activeItem={activeItem}
        currentCollections={currentCollections} 
        currentTools={currentTools} 
        handleClick={handleClick}
        scrollTop={scroll}  
      />
      {activeView}
    </div>
  );
}

export default App;
