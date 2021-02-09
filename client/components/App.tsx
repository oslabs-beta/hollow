// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import { AppState } from './interface.ts';
import Sidebar from './sidebar/Sidebar.tsx';
import Header from './header/Header.tsx';
import ActiveCollection from "./dashboard/activeCollection/ActiveCollection.tsx";
import FieldView from './dashboard/fieldView/FieldView.tsx';
/**
 * @description holds state of app & renders app
 * @state activeItem - stores name of currently selected collection
 * @state view - stores current view (collection, content-builder, plugins, settings)
 * @state collections - stores current collections currently stored in db
 * @state collectionHeaders - stores headers of curenntly selected collection
 * @state collectionEntries - stores array of arrays - each array holds values for a given entry 
 */
class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = { 
      activeItem: '', 
      view: 'collection', 
      collections: [], 
      collectionHeaders: [], 
      collectionEntries: [[]],
      activeEntry: {}
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // On mount:
  // make a request to api to get all table names (collections) - update state with results
  // make a request to api to get active table entries - update state with results
  componentDidMount() {
    fetch('/api/tables')
      .then(data => data.json())
      .then((data) => {
        this.setState({ ...this.state, activeItem: data.data[0], collections: this.state.collections.concat(data.data) })
      })
      .then(() => {
        fetch(`/api/tables/${this.state.activeItem}`)
          .then(data => data.json())
          .then(data => {
            // map headers for active collection
            const headers = data.data.columns.map((header: any) => header.column_name)
            // map entries for active collection
            const entries = data.data.rows.map((entry:any) => Object.values(entry).map(value => value));
            this.setState({ ...this.state, collectionHeaders: headers, collectionEntries: entries } );
          })
          .catch(error => console.log('error', error));
      })
      .catch(error => console.log('error', error));
  };

  /**
   * @description sets state to active item (collection or tool) on click of sidebar item
   * @param event
   */
  handleClick(event: React.MouseEvent) {
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
        this.setState({ view: 'field', activeEntry: entryData })
        break;
      case 'Settings':
        if (this.state.view !== 'settings') {
          this.setState({ activeItem: active, view: 'settings' });
        }
        break;
      case 'Content-Builder':
        if (this.state.view !== 'content-builder') {
          this.setState({ activeItem: active, view: 'content-builder' });
        }
        break;
      case 'Plugins':
        if (this.state.view !== 'plugins') {
          this.setState({ activeItem: active, view: 'plugins' });
        }
        break;

      // default will catch on collection clicks
      // make a request to api to get all table names (collections) - update state with results
      // make a request to api to get active table entries - update state with results
      // set correct view if needed
      default:
        fetch(`/api/tables/${active}`)
          .then(data => data.json())
          .then(data => {
            // map headers for active collection
            const headers = data.data.columns.map((header: any) => header.column_name)
            // map entries fpr active collection
            const entries = data.data.rows.map((entry:any) => Object.values(entry).map(value => value));
            this.setState({ ...this.state, collectionHeaders: headers, collectionEntries: entries } );
          })
          .catch(error => console.log('error', error));
        if (this.state.view !== 'collection') {
          this.setState({ view: 'collection', activeItem: active });
        } else {
          this.setState({ activeItem: active });
        }
    }
  };

  render () {
    // will need to get current collections from api - these are dummy values for testing
    const currentCollections = this.state.collections;
    const currentTools = ['Content-Builder', 'Plugins'];

    // stores component to render - based on view in state
    let activeView;
    
    // set view for collection component
    if (this.state.view === 'collection') {
      activeView = (
        <ActiveCollection 
          activeCollection={this.state.activeItem}
          collectionHeaders={this.state.collectionHeaders}
          collectionEntries={this.state.collectionEntries}
          handleClick={this.handleClick}
        />
      );
    } else if (this.state.view === 'content-builder') {
      // need to create content builder compononent before assinging to activeView
      // activeView = <ContentBuilder />
      activeView = <div></div>;
    } else if (this.state.view === 'plugins') {
      // need to create plugins compononent before assinging to activeView - or not. dont really have a use for it atm
      // activeView = <Plugins />
      activeView = <div></div>;
    } else if (this.state.view === 'settings') {
      // need to create settings compononent before assinging to activeView
      // activeView = <Settings />
      activeView = <div></div>;
    } else if (this.state.view === 'field') {
        activeView = <FieldView activeEntry={this.state.activeEntry} activeItem={this.state.activeItem} />
    }

    return (
      <div>
        <Header text='hi' />
        <Sidebar
          activeItem={this.state.activeItem}
          currentCollections={currentCollections} 
          currentTools={currentTools} 
          handleClick={this.handleClick}  
        />
        {activeView}
      </div>
    );
  }
}

export default App;
