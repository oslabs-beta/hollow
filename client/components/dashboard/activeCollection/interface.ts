/**
 * @description typescript models for ActiveComponent
 */

export interface ActiveCollectionProps {
  activeCollection: string;
  collectionHeaders: string[];
  collectionEntries: string[][];
  handleClick: (event: any) => void;
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