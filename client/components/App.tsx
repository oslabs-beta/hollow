import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import Sidebar from './sidebar/Sidebar.tsx';
import Header from './header/Header.tsx';
import ActiveCollection from "./dashboard/activeCollection/ActiveCollection.tsx";

/**
 * @description holds state of app & renders app
 * @state activeItem - stores name of currently selected collection
 * @state view - stores current view (collection, content-builder, plugins, settings)
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

const App = () => {
  const [activeItem, setActiveItem] = useState('Users');
  const [view, setView] = useState('collection');

  const handleClick = (event: any) => {
    // @ts-ignore
    const active = event.target.innerText;
    setActiveItem(active);

    // Sets correct view based on which item was clicked
    switch(active) {
      case 'Settings':
        if (view !== 'settings') {
          setView('settings');
        }
        break;
      case 'Content-Builder':
        if (view !== 'content-builder') {
          setView('content-builder');
        }
        break;
      case 'Plugins':
        if (view !== 'plugins') {
          setView('plugins');
        }
        break;
      default:
        if (view !== 'collection') {
          setView('collection');
        }
    }
  }

  // will need to get current collections from api - these are dummy values for testing
  const currentCollections = ['Users', 'Reviews', 'Likes'];
  const currentTools = ['Content-Builder', 'Plugins'];

  let activeView;

  if (view === 'collection') {
    activeView = <ActiveCollection activeCollection={activeItem}  />;
  } else if (view === 'content-builder') {
    // need to create content builder compononent before assinging to activeView
    // activeView = <ContentBuilder />
    activeView = <div></div>;
  } else if (view === 'plugins') {
    // need to create plugins compononent before assinging to activeView - or not. dont really have a use for it atm
    // activeView = <Plugins />
    activeView = <div></div>;
  } else if (view === 'settings') {
    // need to create settings compononent before assinging to activeView
    // activeView = <Settings />
    activeView = <div></div>;
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
