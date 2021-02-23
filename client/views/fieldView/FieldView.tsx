import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import { FieldViewProps } from './interface.ts';

const FieldView = ({ activeEntry, activeItem, newEntry, collectionEntries }: FieldViewProps) => {
  const [saveFail, setSaveFail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeEntryValues, setActiveEntryValues] = useState(activeEntry);
  const [newId, setNewId] = useState(0);
  const [changed, setChanged] = useState(0);
  
  // TODO:
  // add handlers to check for correct data type on edit of field values

  const handleSave = (event: any) => {
    event.preventDefault();
    setLoading(true);
  
    //@ts-ignore
    const inputCount = event.target.form.childElementCount;
    const data: any = {};
    let count = 1;
    while (count <= inputCount) {
      //@ts-ignore
      const inputName = event.target.form[count].labels[0].innerText;
      //@ts-ignore
      const value = event.target.form[count].value;
      data[inputName] = value;
      count += 1;
    };

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
    } else {
      const value = activeEntryValues[Object.keys(activeEntryValues)[0]];
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

  const handleDelete = (event: any) => {
    // const fieldCount = event.target.parentNode.parentNode.offsetParent.children.fieldViewForm.elements.length;

    // let count = 1;
    // const dataToDelete: any = {};
    // while (count < fieldCount) {
    //   const field = event.target.parentNode.parentNode.offsetParent.children.fieldViewForm[count].labels[0].htmlFor;
    //   const value = event.target.parentNode.parentNode.offsetParent.children.fieldViewForm[count].value;
    //   dataToDelete[field] = value;
    //   count += 1;
    // }
    const value = activeEntryValues[Object.keys(activeEntryValues)[0][0]];
    fetch(`/api/tables/row/${activeItem}/${value}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));
  };

  useEffect(() => {
    setActiveEntryValues(activeEntry);
    // @ts-ignore
    if (newEntry) setNewId(Number(collectionEntries[collectionEntries.length - 1].id) + 1);
  }, []);

  const handleChange = (event: any) => {
    // @ts-ignore
    const field = event.target.name;
    // @ts-ignore
    const value = event.target.value;

    const dataType = activeEntryValues[field][1]
    const copy = activeEntryValues;
    copy[field] = [value, copy[field][1]];
    if (dataType === 'integer' && isNaN(Number(value))) {
      const dup = Object.assign(activeEntryValues);
      dup[field][0] = value;
      dup[field][2] = `Value should be of type ${dataType}`;
      console.log(dup);
      setActiveEntryValues(dup);
    } else {
      setActiveEntryValues(copy);
    }
    const newCount = changed + 1;
    setChanged(newCount);
  }

  let entryDataArr;

  useEffect(() => {
    console.log('activeEntryValues', activeEntryValues);
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

  let loader;

  if (loading) {
    loader = <div className='saveFieldBtnLoader'></div>;
  } else if (saveFail) {
    loader = (
      <div>
        <svg className='saveFieldFailSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
        </svg>
      </div>
    );
  } else if (saveSuccess) {
    loader = (
      <div className={newEntry ? 'loader' : ''}>   
        <svg className={`saveFieldSuccessSVG ${newEntry ? 'entryFieldSuccessSVG' : ''}`} xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
        </svg>
      </div>    
      
    );
  }

  entryDataArr = Object.entries(activeEntry).map(([field, value], index) => {
    console.log('value in entryArray map', value);
    console.log('active entry values', activeEntryValues[field]);
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

  return (
    <div className='fieldViewContainer'>
      <div className='fieldViewHeader'>
      <div className='deleteContainer'>
        <div className='fieldViewDetails'>
          <p className='fieldViewName'>{newEntry ? newId : activeEntryValues[Object.keys(activeEntryValues)[0]]}</p>
          <p className='fieldViewCollection'>{activeItem}</p>
        </div>
        {!newEntry &&
          (<div className='deleteEntrySVG' onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill='#bd5555'>
              <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
            </svg>
          </div>)
        }
      </div>
        <div className='saveFieldBtnContainer'>     
          {loader} 
         {((!saveSuccess && newEntry) || (!newEntry)) &&
             (<button onClick={handleSave} type='submit' form='fieldViewForm' className='saveFieldBtn'>{newEntry ? 'Add Entry' : 'Save'}</button>)
         }
        </div>
      </div>
      <form id='fieldViewForm' className='fieldViewForm'>
        {entryDataArr}
      </form>
    </div>
  );
};

export default FieldView;