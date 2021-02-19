import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import {
  useState,
  useEffect,
} from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import { FieldViewProps } from './interface.ts';

const FieldView = ({
  activeEntry,
  activeItem,
  newEntry,
  collectionEntries,
}: FieldViewProps) => {
  const [saveFail, setSaveFail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeEntryValues, setActiveEntryValues] = useState({});
  const [newId, setNewId] = useState(0);

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
    }

    if (newEntry) {
      fetch(`/api/tables/${activeItem}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setSaveSuccess(true);
          } else {
            setLoading(false);
            setSaveFail(true);
          }
        })
        .catch((error) => console.log(error));
    } else {
      const value = activeEntryValues[Object.keys(activeEntryValues)[0]];
      fetch(`/api/tables/${activeItem}/${value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setLoading(false);
            setSaveSuccess(true);
          } else {
            setLoading(false);
            setSaveFail(true);
          }
        })
        .catch((error) => console.log(error));
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
    const value = activeEntryValues[Object.keys(activeEntryValues)[0]];
    fetch(`/api/tables/${activeItem}/${value}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setActiveEntryValues(activeEntry);
    if (newEntry)
      setNewId(Number(collectionEntries[collectionEntries.length - 1][0]) + 1);
  }, []);

  const handleChange = (event: any) => {
    // @ts-ignore
    const field = event.target.name;
    // @ts-ignore
    const value = event.target.value;

    const copy = activeEntryValues;
    copy[field] = value;
    setActiveEntryValues(copy);
  };

  const entryDataArr = Object.entries(activeEntry).map(([field, value], index) => {
    if (index === 0) return (
      <div className='fieldViewSect' key={`${field}-${index}`}>
        <label className='fieldViewLabel' htmlFor={field}>{field}</label>
        <input className='fieldViewInput' style={{ color: 'black' }} type='text' id={field} name={field} value={newEntry ? newId : activeEntryValues[field]} onChange={(e: any) => handleChange(e)}  disabled/>
      </div>
    );
    return (
      <div className='fieldViewSect' key={`${field}-${index}`}>
        <label className='fieldViewLabel' htmlFor={field}>{field}</label>
        <input className='fieldViewInput' type='text' id={field} name={field} value={activeEntryValues[field]} onChange={(e: any) => handleChange(e)} />
      </div>
    );
  });

  let loader;

  if (loading) {
    loader = <div className="saveFieldBtnLoader"></div>;
  } else if (saveFail) {
    loader = (
      <div>
        <svg
          className="saveFieldFailSVG"
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
        </svg>
      </div>
    );
  } else if (saveSuccess) {
    loader = (
      <div className={newEntry ? 'loader' : ''}>
        <svg
          className={`saveFieldSuccessSVG ${
            newEntry ? 'entryFieldSuccessSVG' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
        >
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z" />
        </svg>
      </div>
    );
  }

  return (
    <div className='fieldViewContainer'>
      <div className='fieldViewHeader'>
      <div className='deleteContainer'>
        <div className='fieldViewDetails'>
          <p className='fieldViewName'>{newEntry ? newId : activeEntryValues[Object.keys(activeEntryValues)[0]]}</p>
          <p className='fieldViewCollection'>{activeItem}</p>
        </div>
        <div className="saveFieldBtnContainer">
          {loader}
          {((!saveSuccess && newEntry) || !newEntry) && (
            <button
              onClick={handleSave}
              type="submit"
              form="fieldViewForm"
              className="saveFieldBtn"
            >
              {newEntry ? 'Add Entry' : 'Save'}
            </button>
          )}
        </div>
      </div>
      <form id="fieldViewForm" className="fieldViewForm">
        {entryDataArr}
      </form>
    </div>
  );
};

export default FieldView;
