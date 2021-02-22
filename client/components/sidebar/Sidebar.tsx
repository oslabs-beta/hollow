import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { ItemType, SidebarProps, HeaderType } from './interface.ts';

/**
 * @description Renders each individual list item for sidebar
 * @prop type: item name
 * @prop handleClick: sets active state to clicked item
 * @prop active: boolean - sets className to 'active' or 'inactive 
 */
const ListItem = ({ type, handleClick, active }: ItemType) => {
  return (
    <div onClick={(e: any) => handleClick(e)} className='sidebarItem'>
      <p className={active ? 'active' : 'inactive'}>{type}</p>
    </div>
  );
};

/**
 * @description Renders each individual list header for sidebar
 * @prop type: header name
 */
const ListHeader = ({ type }: HeaderType) => {
  return (
    <div>
      <p className='sidebarListHeader'>{type}</p>
    </div>
  );
}

/**
 * @description Renders sidebar component
 * @prop SidebarProps:
 * @prop activeItem - currently selected sidebar item
 * @prop handleClick - handles change of selected sidebar item
 * @prop currentCollections - array of all current collections
 * @prop currentTools - array of all current tools
 */
const Sidebar = ({ currentCollections, currentTools, handleClick, activeItem }: SidebarProps) => {
  // TODO:
  // build settings component
  // build content-builder component
  // fix up styling

  // maps each collection to List item and renders below - currently uses dummy data
    const collections = currentCollections.map((collection, i) => {
      let active = false;
      if (collection === activeItem) active = true;
      return (<ListItem key={collection} type={collection} handleClick={handleClick} active={active} />);
    });

    // maps each tool to List item and renders below - plugins is filler for now
    const tools = currentTools.map((tool, i) => {
      let active = false;
      if (tool === activeItem) active = true;
      return (<ListItem key={tool} type={tool} handleClick={handleClick} active={active} />);
    });

    return (
      <div className='sidebarContainer'>
      <div className='sidebarLogo'>
        hollow
      </div>
      <ListHeader type='Collections' />
      {/* @ts-ignore */}
        <div className='collectionItems'>
          {collections}
        </div>
      <ListHeader type='Tools' />
        {tools}
      <div className='sidebarSettings' onClick={(e: any) => handleClick(e)}>
        <h3>Settings</h3>
      </div>
    </div>
    );
}

export default Sidebar;