import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';
import * as helpers from './sidebarHelpers.tsx';
import { def } from "https://deno.land/std@0.84.0/encoding/_yaml/schema/default.ts";

interface ActiveConfigProps {
  handleActiveChange: (activeItem: string) => void;
  refreshCollections: () => void;
}


const AddNewCollection = ({ handleActiveChange, refreshCollections }: ActiveConfigProps) => {

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
          refreshCollections();
          handleActiveChange(collectionName);
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

  const fieldRows = fields.map((field: {columnName: string, dataType: string}, index: number) => (<helpers.FieldRow
    index={index}
    columnName={field.columnName}
    dataType={field.dataType}
    handleFieldChange={handleFieldChange}
    deleteRow={deleteRow} 
  />));


  return (
    <div className="content-builder">
            <h2>Add New Collection</h2>
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
              {messages.length ? <helpers.FormMessage messages={messages} /> : ''}
            </form>
      </div>
  );
}

export default AddNewCollection;