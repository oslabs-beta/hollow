import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';
import { FieldRowProps, FormMessageProps } from './interface.ts';

/**
 * @description Renders Content-Builder panel to create collections
 */
const ContentBuilder = () => {
  const [displayName, setDisplayName] = useState('');
  const [fields, setFields] = useState([{ columnName: '', dataType: 'text' }]);
  const [messages, setMessages] = useState([]);

  const handleFieldChange = (e: any) => {
    const updatedFields = [...fields];
    updatedFields[e.target.dataset.idx][e.target.className] = e.target.value;
    setFields(updatedFields);
  }

  const validateData = (collectionName: string) => {
    const messageArr = [];
    
    // Ensure user has entered valid display name
    if (!collectionName.length) {
      messageArr.push('Collection name must contain at least one letter.');
    }

    // Ensure user has created at least one field
    // Ensure column names are valid
    if (!fields.some((field: any) => field.columnName.length)) {
      messageArr.push('Create at least one data field and try again.');
    } else if (fields.some((field: any) => /[^a-zA-Z0-9_]/.test(field.columnName))) {
      messageArr.push('Column names can only contain letters, numbers, and underscores.')
    }

    return messageArr;
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const collectionName = displayName.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim().replace(/ +/g, '-');
    const errors = validateData(collectionName);

    if (errors.length) {
      setMessages(errors);
      return;
    }

    fetch('/api/tables', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        collectionName,
        columns: fields
      })
    })
      .then(response => {
        if (response.ok) {
          setDisplayName('');
          setFields([{ columnName: '', dataType: 'text' }]);
          setMessages(['Table created.']);
        } else {
          setMessages(['Error: Could not create table. Please try again.']);
        }
      })
      .catch(err => console.log(err));
  }

  const addRow = (e: any) => {
    const fieldsCopy = fields.slice();
    fieldsCopy.push({ columnName: '', dataType: 'text' });
    setFields(fieldsCopy);
  }

  const deleteRow = (e: any) => {
    if (fields.length > 1) {
      const fieldsCopy = fields.slice();
      fieldsCopy.splice(e.target.dataset.idx, 1);
      setFields(fieldsCopy);
    }
  }

  const fieldRows = fields.map((field: {columnName: string, dataType: string}, index: number) => (<FieldRow
    index={index}
    columnName={field.columnName}
    dataType={field.dataType}
    handleFieldChange={handleFieldChange}
    deleteRow={deleteRow}
  />));

  return (
    <div className="activeCollectionContainer content-builder">
      <h2>Content Builder</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="displayName">Collection Name</label>
          <input
            type="text"
            name="displayName"
            value={displayName}
            onChange={(e: any) => {setDisplayName(e.target.value)}}
          />
        </div>
        <div className="content-table">
          <div>
            <div className="name-col">Field Name</div>
            <div className="type-col">Field Type</div>
            <div className="button-col"></div>
          </div>
          {fieldRows}
        </div>
        <div className="button-group">
          <button type="button" onClick={addRow}>Add New Row</button>
          <input type="submit" value="Add Collection" />
        </div>
        {messages.length ? <FormMessage messages={messages} /> : ''}
      </form>
    </div>
  );
}

/**
 * @description Renders single data row on Content Builder table
 * @param index - Index of data row
 * @param columnName - Name of column, if user has inputted string
 * @param dataType - Type of data (string, number, boolean)
 * @param handleFieldChange - Function that updates the current fields in state
 * @param deleteRow - Deletes the data row
 */
const FieldRow = ({ index, columnName, dataType, handleFieldChange, deleteRow }: FieldRowProps) => {
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
const FormMessage = ({messages}: FormMessageProps) => {
  const errDescriptions = messages.map(message => <li>{message}</li>);

  return (
    <div className="form-error">
      <ul>
        {errDescriptions}
      </ul>
    </div>
  )
}

export default ContentBuilder;