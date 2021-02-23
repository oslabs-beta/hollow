import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import { FieldViewProps } from './interface.ts';

const FieldView = ({ activeEntry, activeItem, newEntry, collectionEntries }: FieldViewProps) => {

  // holds state of api request for updating or adding new entry
  const [saveFail, setSaveFail] = useState(false);

  // holds state of api request for updating or adding new entry
  const [saveSuccess, setSaveSuccess] = useState(false);

  // holds state of api request for updating or adding new entry
  const [loading, setLoading] = useState(false);

  // holds object of each entry. Each key is the field name, each value is
  // an array containing the value of the input box, the data type, and the error message (or empty string if no error)
  const [activeEntryValues, setActiveEntryValues] = useState(activeEntry);
  console.log('activeEntries on mount: fv line 20:', activeEntryValues)

  // holds the value of the id on newly created entries
  const [newId, setNewId] = useState(1);

  // used to force rerender on update of error message in activeEntryValues object
  const [changed, setChanged] = useState(0);

  // set activeEntryValues to passed down activeEntry prop on mount
  // if this is a new entry being created, set id to the id which the entry will be created with in the db
  useEffect(() => {
    // @ts-ignore
    if (newEntry && Number(collectionEntries[collectionEntries.length - 1].id) + 1 !== 0) setNewId(Number(collectionEntries[collectionEntries.length - 1].id) + 1);
  }, []);

  // declare variable to hold 
  let entryDataArr;

  // on update of changed - the state variable updated in handleChange and used to force rerender
  // - rebuild entryDataArr to display error message or remove error message for invalid input values
  useEffect(() => {
    entryDataArr = Object.entries(activeEntry).map(([field, value], index) => {
      
      if (index === 0) return (
        <div className='fieldViewSect' key={`${field}-${index}`}>
          <label className='fieldViewLabel' htmlFor={field}>{field}</label>
          <input className='fieldViewInput' style={{ color: 'black' }} type='text' id={field} name={field} value={newEntry ? newId : activeEntryValues[field][0]} onChange={(e: any) => handleChange(e)}  disabled/>
        </div>
      );
      return (
        <div className='fieldViewSect' key={`${field}-${index}`}>
          <label className='fieldViewLabel' htmlFor={field}>{field}</label>
          <input className='fieldViewInput' type='text' id={field} name={field} value={activeEntryValues[field][0]} onChange={(e: any) => handleChange(e)} />
          {activeEntryValues[field][2].length > 0
            && <p className='fieldViewErrorMsg'>{activeEntryValues[field][2]}</p>
          }
        </div>
      );
    });
  }, [changed]);

  // handle clicks of add entry or save edited entry button
  const handleSave = (event: any) => {
    
    event.preventDefault();

    // reset any past failed or successful requests & set loading to true
    setSaveFail(false);
    setSaveSuccess(false);
    setLoading(true);

    // handle invalid inputs
    // if any inputs are invalid, set failed request state & return
    const valueKeys = Object.keys(activeEntryValues);
    let sendRequest = true;
    valueKeys.forEach(value => {
      if (activeEntryValues[value][2].length > 0) {
        sendRequest = false;
        setLoading(false);
        setSaveFail(true);
      }
    });

    if (!sendRequest) return;

    // holds current count of fields for selected entry
    const inputCount = event.target.form.childElementCount;
    const data: any = {};
    let count = 2;

    // iterate through each field and create as property on object
    // with key of field name & value of the field value
    while (count <= inputCount) {
      const inputName = event.target.form[count].labels[0].innerText;
      let value = event.target.form[count].value;
      // @ts-ignore
      // value === 'false' ? value = false : value === 'true' ? value = true : '';
      data[inputName] = value;
      count += 1;
    };

    // test if this a new entry being created or an active entry being edited
    // if new entry send request to create the new entry and handle loading state based on response
    if (newEntry) {
      fetch(`/api/tables/${activeItem}`, {
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
      .catch(error => console.log(error))

      // if saving an edited entry, send put request with updated information and handle loadng state based on response
    } else {
      const value = activeEntryValues[Object.keys(activeEntryValues)[0]][0];
      fetch(`/api/tables/update/${activeItem}/${value}`, {
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
      .catch(error => console.log(error))
    }
  };

  // handles deletion of selected entry
  const handleDelete = (event: any) => {

    // add popup here to confirm delete

    const value = activeEntryValues[Object.keys(activeEntryValues)[0][0]];
    fetch(`/api/tables/row/${activeItem}/${value}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(res => {
        console.log('delete res: ', res);
      })
      .catch(error => console.log(error));
  };

  // handles changes on each individual input field
  const handleChange = (event: any) => {
    const field = event.target.name;
    const value = event.target.value;
    const dataType = activeEntryValues[field][1]
    const copy = activeEntryValues;
    copy[field] = [value, copy[field][1], ''];

    // handle adding error message to fields where input should be
    // of type integer, but user is inputing value that is not an integer
    // or of type boolean, but user is inputing value that is not a boolean
    if ((dataType === 'integer' && isNaN(Number(value)))
      || (dataType === 'boolean' && (value !== 'false' && value !== 'true'))
    ) {
      const dup = Object.assign(activeEntryValues);
      dup[field][0] = value;
      dup[field][2] = `Value should be of type ${dataType}`;
      setActiveEntryValues(dup);

      // if no errors with input value, set activeEntryValues to
      // current activeEntryValues with updated value for selected input
    } else {
      copy[field] = [value, copy[field][1], ''];
      setActiveEntryValues(copy);
    }

    // update changed state to force rerender
    const newCount = changed + 1;
    setChanged(newCount);
  }


  // declare variable which will hold the correct loading svg to render based on loading state
  let loader;

  // if loading is true set loader to loading spinner
  if (loading) {
    loader = <div className='saveFieldBtnLoader'></div>;

    // if saveFail is true, set loader to failed svg x
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

    // if saveSuccess is true, set loader to success svg checkmark
  } else if (saveSuccess) {
    loader = (
      <div className={newEntry ? 'loader' : ''}>   
        <svg 
          className={`saveFieldSuccessSVG ${newEntry ? 'entryFieldSuccessSVG' : ''}`} 
          xmlns="http://www.w3.org/2000/svg" 
          width="15" 
          height="15" 
          viewBox="0 0 24 24"
        >
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
        </svg>
      </div>    
      
    );
  }

  // map through activeEntry entries and render labels & input fields for each entry
  // set the id field as disabled because it cannot be edited - id field should always be at index 0
  entryDataArr = Object.entries(activeEntry).map(([field, value], index) => {
    console.log('data being passed in to inputs:', [field, value])
    if (index === 0) return (
      <div
        className='fieldViewSect'
        key={`${field}-${index}`}
      >
        <label 
          className='fieldViewLabel' 
          htmlFor={field}
        >
          {field}
        </label>
        <input 
          className='fieldViewInput' 
          style={{ color: 'black' }} 
          type='text' id={field} 
          name={field} 
          value={newEntry ? newId : activeEntryValues[field][0]} 
          onChange={handleChange}
          disabled
        />
      </div>
    );
    return (
      <div 
        className='fieldViewSect' 
        key={`${field}-${index}`}
      >
        <label 
          className='fieldViewLabel' 
          htmlFor={field}
        >
          {field}
        </label>
        <input 
          className='fieldViewInput' 
          type='text' 
          id={field} 
          name={field} 
          value={activeEntryValues[field][0]} 
          onChange={handleChange} 
        />
        {activeEntryValues[field][2].length > 0
          && <p className='fieldViewErrorMsg'>{activeEntryValues[field][2]}</p>
        }
      </div>
    );
  });

  return (
    <div className='fieldViewContainer'>
      <div className='fieldViewHeader'>
      <div className='deleteContainer'>
        <div className='fieldViewDetails'>
          <p className='fieldViewName'>{newEntry ? newId : activeEntryValues[Object.keys(activeEntryValues)[0]][0]}</p>
          <p className='fieldViewCollection'>{activeItem}</p>
        </div>
        {!newEntry &&
          (<div 
            className='deleteEntrySVG' 
            onClick={handleDelete}
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
          </div>)
        }
      </div>
        <div className='saveFieldBtnContainer'>     
          {loader} 
          {/* if saveSuccess is false and this is a new entry being added or
          this is an active entry being edited, render the button to add or save entry */}
         {((!saveSuccess && newEntry) || (!newEntry)) &&
             (<button 
                onClick={handleSave} 
                type='submit' 
                form='fieldViewForm' 
                className='saveFieldBtn'
              >
               {newEntry ? 'Add Entry' : 'Save'}
             </button>)
         }
        </div>
      </div>
      <form 
        id='fieldViewForm' 
        className='fieldViewForm'
      >
        {entryDataArr}
      </form>
    </div>
  );
};

export default FieldView;