
/**
 * @description typescript models for ActiveComponent
 */

export interface ActiveCollectionProps {
  activeCollection: string;
  collectionHeaders: string[];
  collectionEntries: string[][];
}

export interface EntryProps  {
  values: Array<string>;
  index: number;
  fieldNames: Array<string>;
}

export interface FieldProps {
  fieldName: string;
  activeCollection: string;
}

export interface ActiveCollectionState {
  activePage: string;
  activeResultsPerPage: string;
}