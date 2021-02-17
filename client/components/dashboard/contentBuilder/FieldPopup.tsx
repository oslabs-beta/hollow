import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

interface FieldPopupProps {
  handleFieldPopupSuccess: () => void;
}

const FieldPopup = ({ handleFieldPopupSuccess }: FieldPopupProps) => {

  const [fields, setFields] = useState([{ columnName: '', dataType: 'text' }]);
  const [messages, setMessages] = useState([]);
  const [saveFail, setSaveFail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (e: any) => {
    const updatedFields = [...fields];
    updatedFields[e.target.dataset.idx][e.target.className] = e.target.value;
    setFields(updatedFields);
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const data: any = {
      column_name: event.target.form[0].value,
      data_type: event.target.form[1].selectedOptions[0].value
    };

    console.log(data);

    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
    }, 5000)
    
  };

  useEffect(() => {
    setTimeout(() => {
      handleFieldPopupSuccess();
    }, 10000)
  }, [saveSuccess])

  let loader;

  if (loading) {
    loader = <div className='saveFieldBtnLoader popupLoader'></div>;
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
        <svg className='addSuccessSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
          <path d="M0 11c2.761.575 6.312 1.688 9 3.438 3.157-4.23 8.828-8.187 15-11.438-5.861 5.775-10.711 12.328-14 18.917-2.651-3.766-5.547-7.271-10-10.917z"/>
        </svg>
    );
  }


  return (
    <div className='fieldPopupContainer'>
      <h3 className='addFieldPopupHeader'>Add Field</h3>
      <form className='fieldPopupForm' id='fieldPopupForm' >
        <label className='newFieldPopupLabel' htmlFor='fieldName'>Enter Field Name</label>
        <input className='newFieldPopupInput' data-idx='0' type='text' id='fieldName' name='fieldName' value={fields.columnName} onChange={handleFieldChange} />
        <label className='newFieldPopupLabel' htmlFor='dataType'>Select Data Type</label>
        <select
          data-idx='0'
          className="dataType"
          value={fields.dataType}
          onChange={handleFieldChange}
          id='dataType'
          name='dataType'
        >
          <option value="text">Text</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>
      </form>
      <div className='fieldPopupBtnContainer'>
        {(loading || saveSuccess || saveFail)
          ?  loader
          : <p className='fieldPopupCancel' onClick={() => handleFieldPopupSuccess()}>cancel</p>
        }
        <button className='fieldPopupBtn' type='submit' form='fieldPopupForm' onClick={handleSubmit} >Add Field</button>
      </div>
      
    </div>
  );
};

export default FieldPopup;