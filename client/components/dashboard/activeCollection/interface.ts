// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

/**
 * @description typescript models for ActiveComponent
 */

export interface ActiveCollectionProps {
  activeCollection: string;
  collectionHeaders: string[];
  collectionEntries: string[][];
  handleClick: (event: React.MouseEvent) => void;
}

export interface EntryProps  {
  values: Array<string>;
  index: number;
  fieldNames: Array<string>;
  handleClick: (event: React.MouseEvent) => void;
  activeCollection: string;
  entryCount: number;
}

export interface FieldProps {
  fieldName: string;
  activeCollection: string;
}

export interface ActiveCollectionState {
  activePage: string;
  activeResultsPerPage: string;
}