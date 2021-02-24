// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';

// import type definitions
import { ItemType, HeaderType } from './interface.ts';


/**
 * @description - Renders each individual list item for sidebar
 * 
 * @param type - string containing active sidebar item name
 * 
 * @param handleClick - function which sets active state to clicked item
 * 
 * @param active - boolean which sets className to 'active' or 'inactive to display highlighted
 * active sidebar items or greyed out sidebar items
 */


export const ListItem = ({ type, handleClick, active }: ItemType) => {
  return (
    <div onClick={(e: any) => handleClick(e)} className='sidebarItem'>
      <p className={active ? 'active' : 'inactive'}>{type}</p>
    </div>
  );
};

/**
 * @description - Renders each individual list header for sidebar
 * 
 * @param type - header name
 */

export const ListHeader = ({ type }: HeaderType) => {
  return (
    <div>
      <p className='sidebarListHeader'>{type}</p>
    </div>
  );
}