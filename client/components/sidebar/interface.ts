// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

/**
 * @description typescript models for sidebar
 */

export interface ItemType {
  type: string;
  handleClick: (event: React.MouseEvent) => void;
  active: boolean;
}

export interface HeaderType {
  type: string;
}

export interface SidebarProps {
  activeItem: string;
  currentCollections: Array<string>;
  currentTools: Array<string>;
  handleClick: (event: React.MouseEvent) => void;
}