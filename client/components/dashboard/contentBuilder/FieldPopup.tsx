import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

interface FieldPopupProps {
  handleFieldPopupSuccess: () => void;
  activeConfig: string;
}

/**
 * @description renders popup container which allows user to add a new field to selected 
 * collection while inside content-builder. If request to api returns success, popup will
 * unmount then refresh currently selected collection's field's to display newly added field.
 * 
 * @prop handleFieldPopSuccess - handler function defined in ActiveConfigView.tsx
 * sets timeout for 4 seconds, then refreshes selected collection's current field's
 * & sets fieldActivePopup to false, unmounting FieldPopup from the DOM.
 * 
 * @prop activeConfig - holds currently selected collection in content-builder.
 */


const FieldPopup = ({ handleFieldPopupSuccess, activeConfig }: FieldPopupProps) => {

  // holds current values for columName & dataType of selected field. Updates on change
  const [fields, setFields] = useState([{ columnName: '', dataType: 'text' }]);
  // holds boolean representing a failed api request
  const [saveFail, setSaveFail] = useState(false);
  // holds a boolean representing a successful api request
  const [saveSuccess, setSaveSuccess] = useState(false);
  // holds a boolean representing loading state of api request
  const [loading, setLoading] = useState(false);


  // function which is invoked on any changes to input fields - sets field state to selected 
  // input value on any change
  const handleFieldChange = (e: any) => {
    const updatedFields = [...fields];
    updatedFields[e.target.dataset.idx][e.target.className] = e.target.value;
    setFields(updatedFields);
  }

  // function which is invoked on submission of form - onClick of Add Field button
  // sets loading state to true - rendering loading spinner
  // makes api request, then sets saveSuccess or saveFail to true based on response
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const data: any = {
      column_name: event.target.form[0].value,
      data_type: event.target.form[1].selectedOptions[0].value
    };

    fetch(`/api/tables/${activeConfig}/${data.column_name}`, {
      method: 'POST',
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

  // invoked on updates to saveSuccess state
  // invokes handleFieldPopupSuccess
  useEffect(() => {
    handleFieldPopupSuccess();
  }, [saveSuccess])


  // declare loader - holds jsx for active loader to display - spinner, saveSuccess, or saveFail based on state
  let loader;

  if (loading) {
    loader = <div className='saveFieldBtnLoader popupLoader'></div>;
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
  } else if (saveSuccess) {
    loader = (
        <svg 
          className='addSuccessSVG' 
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
    <div className='fieldPopupContainer'>
      <h3 className='addFieldPopupHeader'>Add Field</h3>
      <form 
        className='fieldPopupForm' 
        id='fieldPopupForm' 
      >
        {/* label & input for selected field name */}
        <label 
          className='newFieldPopupLabel' 
          htmlFor='fieldName'
        >
          Enter Field Name
        </label>
        <input 
          className='newFieldPopupInput' 
          data-idx='0' 
          type='text' 
          id='fieldName' 
          name='fieldName' 
          value={fields.columnName} 
          onChange={handleFieldChange} 
        />
        {/* label & input for selected field data type */}
        <label className='newFieldPopupLabel' htmlFor='dataType'>Select Data Type</label>
        <select
          data-idx='0'
          className="dataType"
          value={fields.dataType}
          onChange={handleFieldChange}
          id='dataType'
          name='dataType'
        >
          <option value="character varying">character varying</option>
          <option value="integer">integer</option>
          <option value="boolean">boolean</option>
        </select>
      </form>
      <div className='fieldPopupBtnContainer'>
        {/* if either loading, saveSuccess, or saveFail are true, render loader to DOM
          * if all are false, render Add Field button to DOM
          */}
        {(loading || saveSuccess || saveFail)
          ?  loader
          : (<p 
              className='fieldPopupCancel' 
              onClick={() => handleFieldPopupSuccess()}
             >
              cancel
             </p>)
        }
        <button 
          className='fieldPopupBtn' 
          type='submit' 
          form='fieldPopupForm' 
          onClick={handleSubmit} 
        >
          Add Field
        </button>
      </div>
      
    </div>
  );
};

export default FieldPopup;