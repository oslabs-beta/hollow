/**
 * @description type definitions for ActiveCollection
 */

/******************************************************************************************* */

// ActiveCollection

export interface ActiveCollectionProps {
  activeCollection: string;
  refreshCollections: () => void;
  resultsView: boolean;
  handleResultsView: (open: boolean) => void;
}

/******************************************************************************************* */

// helpers 

export interface EntryProps  {
  values: Array<string>;
  index: number;
  fieldNames: Array<string>;
  handleClick: (event: any) => void;
}

export interface FieldProps {
  fieldName: string;
  activeCollection: string;
}
