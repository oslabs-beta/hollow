/**
 * @description type defintions for Content-Builder
 */

/******************************************************************************************* */

// ContentBuilder

export interface ContentBuilderProps {
  handleActiveChange: (activeItem: string) => void;
  refreshCollections: () => void;
  currentCollections: string[];
}

/******************************************************************************************* */

// sidebarHelpers

export interface FieldRowProps {
  index: number;
  columnName: string;
  dataType: string;
  handleFieldChange: any;
  deleteRow: any;
}

export interface ItemType {
  type: string;
  handleCollectionConfig: (event: any) => void;
  active: boolean;
  handleFieldClick: (event: any) => void;
}

export interface FormMessageProps {
  messages: string[];
}

/******************************************************************************************* */

// FieldPopup

export interface FieldPopupProps {
  handleFieldPopupSuccess: () => void;
  activeConfig: string;
  handleFieldPopupclose: () => void;
}

/******************************************************************************************* */

// FieldEdit

export interface FieldEditProps {
  fieldEditData: any;
  activeConfig: string;
  handleFieldClick: (event: any) => void;
  refreshConfigView: () => void;
}

/******************************************************************************************* */

// AddNewCollection

export interface AddNewCollectionProps {
  handleActiveChange: (activeItem: string) => void;
  refreshCollections: () => void;
  currentCollections: string[];
}

/******************************************************************************************* */

// ActiveConfigView

export interface ActiveConfigProps {
  handleActiveChange: (activeItem: string) => void;
  refreshCollections: () => void;
  activeConfigFields: string[][];
  refreshConfigView: () => void;
  handleFieldClick: (event: any) => void;
  fieldEditActive: boolean;
  fieldEditData: object;
  activeConfig: string;
  currentCollections: string[];
}

/******************************************************************************************* */

// activeConfigHelpers

export interface EntryProps {
  values: string[];
  index: number;
  handleFieldClick: (event: any) => void;
 }