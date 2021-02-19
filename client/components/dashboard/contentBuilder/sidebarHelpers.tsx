import { h } from 'https://unpkg.com/preact@10.5.12?module';

/**
 * @description Renders each individual list item for sidebar
 * @prop type: item name
 * @prop handleClick: sets active state to clicked item
 * @prop active: boolean - sets className to 'active' or 'inactive 
 */
interface ItemType {
  type: string;
  handleCollectionConfig: (event: any) => void;
  active: boolean;
  handleFieldClick: (event: any) => void;
}

export const ListItem = ({ type, handleCollectionConfig, active, handleFieldClick }: ItemType) => {
  return (
    <div className='sidebarItem' onClick={(e: any) => {
      handleCollectionConfig(e);
      handleFieldClick(e);
    }}>
      <p className={active ? 'active' : 'inactive'}>{type}</p>
    </div>
  );
};


/**
 * @description Renders single data row on Content Builder table
 * @param index - Index of data row
 * @param columnName - Name of column, if user has inputted string
 * @param dataType - Type of data (string, number, boolean)
 * @param handleFieldChange - Function that updates the current fields in state
 * @param deleteRow - Deletes the data row
 */

export interface FieldRowProps {
  index: number;
  columnName: string;
  dataType: string;
  handleFieldChange: any;
  deleteRow: any;
}

export const FieldRow = ({ index, columnName, dataType, handleFieldChange, deleteRow }: FieldRowProps) => {
  return (
    <div key={`row-${index}`}>
      <div className="name-col">
        <input
          data-idx={index}
          className="columnName"
          type="text"
          value={columnName}
          onChange={handleFieldChange}
        />
      </div>
      <div className="type-col">
        <select
          data-idx={index}
          className="dataType"
          value={dataType}
          onChange={handleFieldChange}
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
      </div>
      <div className="button-col">
        <button
          data-idx={index}
          type="button"
          onClick={deleteRow}
        >
          Delete Row
        </button>
      </div>
    </div>
  );
}


/**
 * @description Renders error messages or table submission confimration
 * @param messages - array of messages to display
 */


interface FormMessageProps {
  messages: string[];
}


export const FormMessage = ({messages}: FormMessageProps) => {
  const errDescriptions = messages.map(message => <li>{message}</li>);

  return (
    <div className="form-error">
      <ul>
        {errDescriptions}
      </ul>
    </div>
  )
}