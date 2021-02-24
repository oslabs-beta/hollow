// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';

// import components
import * as helpers from './helpers.tsx';

// import type definitions
import { SidebarProps } from './interface.ts';

/******************************************************************************************* */


/**
 * @description - Renders sidebar component which allows for clicks between different collections
 * and the content builder
 * 
 * @param currentCollections - array of all current collections
 * 
 * @param currentTools - array of all current tools
 * 
 * @param handleClick - handles change of selected sidebar item
 * 
 * @param activeItem - currently selected sidebar item
 */
const Sidebar = ({ 
  currentCollections, 
  currentTools, 
  handleClick, 
  activeItem }: SidebarProps) => {

  // maps each collection to collections array

    const collections = currentCollections.map((collection, i) => {
      let active = false;
      if (collection === activeItem) active = true;
      return (
        <helpers.ListItem
          key={collection}
          type={collection}
          handleClick={handleClick}
          active={active} 
        />
      );
    });

    // maps each tool to tools array and renders below - currently the
    // only tool we have built out is the content builder, but we would like
    // to implement some kind of plugin tool to add and manage possible future plugins

    const tools = currentTools.map((tool, i) => {
      let active = false;
      if (tool === activeItem) active = true;
      return (
        <helpers.ListItem
          key={tool}
          type={tool}
          handleClick={handleClick}
          active={active} 
        />
      );
    });

    return (
      <div className='sidebarContainer'>
      <div className='sidebarLogo'>
        hollow
      </div>
      <helpers.ListHeader type='Collections' />
      {/* @ts-ignore */}
        <div className='collectionItems'>
          {collections}
        </div>
      <helpers.ListHeader type='Tools' />
      {tools}
    </div>
    );
}

export default Sidebar;