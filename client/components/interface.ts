// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

/**
 * @ description typescript models for App
 */

export interface AppState {
  activeItem: string;
  view: string;
  collections: string[];
  collectionHeaders: string[];
  collectionEntries: string[][];
}
