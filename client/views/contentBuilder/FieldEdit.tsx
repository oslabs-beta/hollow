// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

// import type definitions
import { FieldEditProps } from './interface.ts';

/******************************************************************************************* */

/**
 * @description this component renders the view for clicking on each individual field name
 * in the content builder and giving the option to edit or delete the selected field from the collection.
 * For deleteing a confirmation popup is displayed to confirm the request to delete.
 * 
 * @param fieldEditData - an object containing the data for the selected field
 * 
 * @param activeConfig - a string holding the selected collection name
 * 
 * @param handleFieldClick - a function which is used in this component to set the view to show all
 * fields for a collection when an individual field is deleted
 * 
 * @param refreshConfigView - a function which is used to make a new request to get any newly added or
 * edited fields for the selected collection. This forces an update and rerender to reflect those new changes
 */

const FieldEdit = ({
  fieldEditData,
  activeConfig, 
  handleFieldClick,
  refreshConfigView }: FieldEditProps) => {

  // an object holding all inputs for a selected field (name, data type)
  const [configFields, setConfigFields] = useState({});
  
  // holds boolean representing a failed api request
  const [saveFail, setSaveFail] = useState(false);

  // holds a boolean representing a successful api request
  const [saveSuccess, setSaveSuccess] = useState(false);

  // holds a boolean representing loading state of api request
  const [loading, setLoading] = useState(false);

  // holds a boolean which determines whether to open (true) or close (false)
  // the confirm delete popup
  const [deletePopup, setDeletePopup] = useState(false);

/******************************************************************************************* */

  // invoked on component mount, updates configFields object with the correct data
  // from fieldEditData prop

  useEffect(() => {
    const entries = Object.entries(fieldEditData)
    const fieldsState: any = {};
    entries.forEach(field => {
      fieldsState[field[0]] = field[1];
    });
    setConfigFields(fieldsState);
  }, []);

  const handleChange = (event: any) => {
    const fieldState = configFields;
  };

  // function which handles save when editing a field
  // makes request to api which updates the edited values in the db
  // also sets loading state depending on response
  const handleFieldEditSave = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const data: any = {};
    data.column_name = event.target.form[1].value;
    data.data_type = event.target.form[2].value;
    fetch(`/api/tables/${activeConfig}/${fieldEditData.column_name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        setLoading(false);
        setSaveSuccess(true);
      } else {
        setLoading(false);
        setSaveFail(true);
      }
    })
    .catch(err => console.error(err));
  };

  // Renders the popup box which confirms that the user
  // intends to delete the selected field
  const ConfirmDelete = () => {
    return (
      <div className='confirmDeletePopup'>
        <p className='confirmDeleteText'>
          Are you sure you want to delete 
          <br></br>
          <span className='confirmDeleteHighlight'> {fieldEditData.column_name} </span> 
            from 
          <span className='confirmDeleteHighlight'>  {activeConfig}</span>
          ?
        </p>
        <div className='confirmDeleteBtnContainer'>
          <p 
            className='confirmDeleteCancel' 
            onClick={() => setDeletePopup(false)}
          >
            cancel
          </p>
          <button 
            className='confirmDeleteBtn' 
            onClick={(e: any) => handleDelete(e)}
          >
            Delete Field
          </button>
        </div>
      </div>
    );
  };

  // handles deletion of selected field
  const handleDelete = (event: any) => {

    // sets confirm delete popup to true (open), if its currently false (closed)
    if (!deletePopup) setDeletePopup(true);

    // if the clicked buttons className is equal to 'confirmDeleteBtn',
    // delete selected field & reset view back to all of the collections fields
    if (event.target.className === 'confirmDeleteBtn') {
      fetch(`/api/tables/${activeConfig}/${fieldEditData.column_name}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(res => {
        setDeletePopup(false);
        handleFieldClick(event);
        refreshConfigView();
      })
      .catch(err => console.error(err));
    }
    
  }

  // harcoded labels for use when mapping fields array below
  const labels = ['Field Name', 'Data Type'];
  const reads = ['column_name', 'data_type'];
  
  // maps each individual field input
  const fields = Object.entries(fieldEditData).map((field, index) => {
    let selected: any = '';
    if (index === 1) selected = field[1]; 
    // when index is 0, field will be the id
    return index === 0
      ? (
        <div className='fieldViewSect'>
          <label 
            className='fieldViewLabel'
            htmlFor={labels[index]}
          >
            {labels[index]}
          </label>
          <input 
            className='fieldViewInput'
            style={{ color: 'black' }}
            type='text'
            id={field[1]} 
            name={field[1]}
            value={configFields[reads[index]]}
            onChange={(e: any) => handleChange(e)}
            disabled
          />
        </div>
      )
      : (
        <div className='fieldViewSect'>
          <label
            className='fieldViewLabel'
            htmlFor='dataType'
          >
            Data Type
          </label>
          {/* dropdown for data type */}
          <select
            data-idx='0'
            className="dataType"
            value={configFields.data_type}
            onChange={handleChange}
            id='dataType'
            name='dataType'
          >
            <option value="character varying" >character varying</option>
            <option value="integer" >integer</option>
            <option value="boolean" >Boolean</option>
          </select>
        </div>
      );
  });

  // declare loader - holds jsx for active loader to display - spinner, saveSuccess, or saveFail based on state
  let loader;

  // if loading is true, set loader to loading spinner
  if (loading) {
    loader = <div className='saveFieldBtnLoader'></div>;

    // if saceFail is true, set loader to fail x
  } else if (saveFail) {
    loader = (
      <div>
        <svg 
          className='saveFieldFailSVG'
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
        </svg>
      </div>
    );

    // if saveSuccess is true, set loader to success checkmark
  } else if (saveSuccess) {
    loader = (
        <svg
          className='saveFieldSuccessSVG'
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
        </svg>    
    );
  }

  return (
    <div className='fieldEditContainer'>
      <div className='fieldEditHeader'>
        <div className='fieldEditDeleteContainer'>
          <div className='fieldEditDetails'>
            <p className='fieldEditName'>Name</p>
            <p className='fieldEditCollection'>Collection</p>
          </div>
          {/* svg for deleting field */}
          <div 
            className='deleteEntrySVG'
            onClick={() => handleDelete(fieldEditData)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill='#bd5555'
            >
              <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
            </svg>
          </div>
        </div>
        <div className='fieldEditBtnContainer'>
          {/* if loading is true, saveSuccess is true, or saveFail is true 
            * render the loader
          */}
          {(loading || saveSuccess || saveFail)
             && loader
          }
          <button
            onClick={handleFieldEditSave}
            type='submit'
            form='fieldEditForm'
            className='fieldEditBtn'
          >
            Save
          </button>
        </div>
      </div>
      {/* if deletePopup is true render deletePopup to screen */}
      {deletePopup
        && <ConfirmDelete />
      }
      <form 
        className='fieldEditForm' 
        id='fieldEditForm'
      >
        {fields}
      </form>
    </div>
  );
};

export default FieldEdit;