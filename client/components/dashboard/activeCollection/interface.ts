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
  index: number;
  fieldName: string;
  activeCollection: string;
}

export interface AddEntryProps {
  
}