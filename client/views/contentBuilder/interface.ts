/**
 * @description typescript interfaces for Content-Builder
 */

export interface FieldRowProps {
  index: number;
  columnName: string;
  dataType: string;
  handleFieldChange: any;
  deleteRow: any;
}

export interface FormMessageProps {
  messages: string[];
}

export interface ContentBuilderProps {
  handleActiveChange: (activeItem: string) => void;
  refreshCollections: () => void;
  currentCollections: string[];
}