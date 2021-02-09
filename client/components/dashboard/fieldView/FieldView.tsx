import { h, Fragment } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

import { FieldViewProps } from './interface.ts';

const FieldView = ({ activeEntry, activeItem }: FieldViewProps) => {
  const [saveFail, setSaveFail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeEntryValues, setActiveEntryValues] = useState({});

  // TODO:
  // add handlers to check for correct data type on edit of field values
  // make request to update and handle loading state correctly

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
    console.log(data);
  };

  useEffect(() => {
    setActiveEntryValues(activeEntry);
  }, []);

  const handleChange = (event: any) => {
    console.log(event.target);
    // @ts-ignore
    const field = event.target.name;
    // @ts-ignore
    const value = event.target.value;

    const copy = activeEntryValues;
    copy[field] = value;
    setActiveEntryValues(copy);
  }

  console.log(activeEntry);
  const entryDataArr = Object.entries(activeEntry).map(([field, value], index) => (
    <div className='fieldViewSect' key={`${field}-${index}`}>
      <label className='fieldViewLabel' htmlFor={field}>{field}</label>
      <input className='fieldViewInput' type='text' id={field} name={field} value={activeEntryValues[field]} onChange={(e: any) => handleChange(e)} />
    </div>
  ));

  console.log(entryDataArr);
  let loader;

  if (loading) {
    loader = <div className='saveFieldBtnLoader'></div>;
  } else if (saveFail) {
    loader = (
      <svg className='saveFieldFailSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
        <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
      </svg>
    );
  } else if (saveSuccess) {
    loader = (
      <svg className='saveFieldSuccessSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
        <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
      </svg>
    );
  }

  return (
    <div className='fieldViewContainer'>
      <div className='fieldViewHeader'>
        <div className='fieldViewDetails'>
          <p className='fieldViewName'>{Object.keys(activeEntry)[0]}</p>
          <p className='fieldViewCollection'>{activeItem}</p>
        </div>
        <div className='saveFieldBtnContainer'>
          {loader}            
          <button onClick={handleSave} type='submit' form='fieldViewForm' className='saveFieldBtn'>Save</button>
        </div>
        
      </div>
      <form id='fieldViewForm' className='fieldViewForm'>
        {entryDataArr}
      </form>
    </div>
  );
};

export default FieldView;