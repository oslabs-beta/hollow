/**
 * @description type definitions for FieldView
 */

/******************************************************************************************* */

// FieldView

 export interface FieldViewProps {
  activeEntry: object;
  activeItem: string;
  newEntry: boolean;
  collectionEntries: string[][];
  handleResultsView: (open: boolean) => void;
 }