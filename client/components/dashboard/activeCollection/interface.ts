/**
 * @description typescript models for ActiveComponent
 */

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export interface ActiveCollectionProps {
  activeCollection: string;
  collectionHeaders: string[];
  collectionEntries: string[][];
  handleClick: (event: any) => void;
  refreshCollections: () => void;
}

export interface EntryProps  {
  key: string;
  values: Array<string>;
  index: number;
  fieldNames: Array<string>;
  handleClick: (event: any) => void;
  activeCollection: string;
  entryCount: number;
}

export interface FieldProps {
  fieldName: string;
  activeCollection: string;
}

export interface AddEntryProps {
  
}