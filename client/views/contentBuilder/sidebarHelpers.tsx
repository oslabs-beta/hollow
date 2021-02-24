// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';

// import type definitions
import { ItemType, FieldRowProps, FormMessageProps } from './interface.ts'; 

/******************************************************************************************* */

/**
 * @description Renders each individual list item for sidebar
 * 
 * @param type - item name (string)
 * 
 * @param handleClick -function which sets active state to clicked item
 * 
 * @param active - boolean which sets className as either 'active' (true) or 'inactive (false)
 */

export const ListItem = ({ 
  type, 
  handleCollectionConfig, 
  active, 
  handleFieldClick }: ItemType) => {
    
  return (
    <div className='sidebarItem' onClick={(e: any) => {
      handleCollectionConfig(e);
      handleFieldClick(e);
    }}>
      <p className={active ? 'active' : 'inactive'}>{type}</p>
    </div>
  );
};

/******************************************************************************************* */

/**
 * @description Renders single data row on Content Builder table
 * 
 * @param index - Index of data row (number)
 * 
 * @param columnName - Name of column, if user has inputted string (string)
 * 
 * @param dataType - Type of data (cahracter varying, integer, boolean) (string)
 * 
 * @param handleFieldChange - Function that updates the current fields in state
 * 
 * @param deleteRow - Deletes the data row
 */

export const FieldRow = ({ 
  index, 
  columnName, 
  dataType, 
  handleFieldChange, 
  deleteRow }: FieldRowProps) => {

  return (
    <div key={`row-${index}`} className='additionalInputs'>
      <div className="name-col">
        <input
          data-idx={index}
          className="columnName"
          type="text"
          value={columnName}
          onChange={handleFieldChange}
        />
      </div>
      <div className="type-col selectType">
        <select
          data-idx={index}
          className="dataType"
          value={dataType}
          onChange={handleFieldChange}
        >
          <option value="text">character varying</option>
          <option value="number">integer</option>
          <option value="boolean">boolean</option>
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

/******************************************************************************************* */

/**
 * @description Renders error messages or table submission confimration
 * 
 * @param messages - array of messages to display
 */

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