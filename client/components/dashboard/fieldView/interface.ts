/**
 * @description typescript models for sidebar
 */

 export interface FieldViewState {
   saveFail: boolean;
   saveSuccess: boolean;
   loading: boolean;
   activeEntryValues: any;
 }

 export interface FieldViewProps {
  activeEntry: object;
  activeItem: string;
 }