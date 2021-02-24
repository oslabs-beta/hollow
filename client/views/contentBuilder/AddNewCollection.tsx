// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

// import components
import * as helpers from './sidebarHelpers.tsx';

// import type definitions
import { AddNewCollectionProps } from './interface.ts';

/******************************************************************************************* */

/**
 * @description this component renders the view for adding a new collection inside of the 
 * content builder.
 * 
 * @param handleActiveChange - function to handle changes to the active collection name to 
 * the newly created collection
 * 
 * @param refreshCollections - function which forces a rerender of the active collections to 
 * reflect any changes
 * 
 * @param currentCollections - an array containing the current collections
 */

const AddNewCollection = ({ 
  handleActiveChange, 
  refreshCollections, 
  currentCollections }: AddNewCollectionProps) => {

  // holds the colleciton name as a string
  const [displayName, setDisplayName] = useState('');

  // holds an object containing two properties
  // a columName key with a value of a string & a dataType key
  // with a value of a string - defaulted to text
  //
  // this is used to hold the selected information for the current field being created
  const [fields, setFields] = useState([{ columnName: '', dataType: 'text' }]);

  // holds any error messages that may arise form invalid input
  const [messages, setMessages] = useState([]);

  /******************************************************************************************* */

  // function which handles changes to field inputs by setting fields state
  // to values inputed by user

  const handleFieldChange = (e: any) => {
    const updatedFields = [...fields];
    updatedFields[e.target.dataset.idx][e.target.className] = e.target.value;
    setFields(updatedFields);
  }

  // function which is used to validate the form input data
  // and display the correct error messages

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
    } else if (currentCollections.includes(collectionName)) {
      messageArr.push('Collection name already exists. Must use a unique name')
    }
    return messageArr;
  }

  // function which handles submission of new collection
  // sends request to create information in db and 
  // changes view to the newly created collections active entry view
  // as well as forces a rerender of sidebar to reflect new collection being created

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

  // function which handles updated fields with a new object containing the new fields
  // input values

  const addRow = (e: any) => {
    const fieldsCopy = fields.slice();
    fieldsCopy.push({ columnName: '', dataType: 'text' });
    setFields(fieldsCopy);
  }

  // function which handles removing field objects already created from fields state - before collection is created

  const deleteRow = (e: any) => {
    if (fields.length > 1) {
      const fieldsCopy = fields.slice();
      fieldsCopy.splice(e.target.dataset.idx, 1);
      setFields(fieldsCopy);
    }
  }

  // map fields to field rows and render to display currently created fields

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
                <div className='rowBuilder'>
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