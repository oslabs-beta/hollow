import { h } from 'https://unpkg.com/preact@10.5.12?module';

/**
 * @description typescript models
 */

export interface ItemType {
  key: string;
  type: string;
  handleClick: (event: any) => void;
  active: boolean;
}

export interface HeaderType {
  type: string;
}

export interface SidebarProps {
  activeItem: string;
  currentCollections: Array<string>;
  currentTools: Array<string>;
  handleClick: (event: any) => void;
}