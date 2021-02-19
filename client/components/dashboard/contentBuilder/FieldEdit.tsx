import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

interface FieldEditProps {
  activeConfigFields: string[][];
  fieldEditData: object;
}

const FieldEdit = ({ activeConfigFields, fieldEditData }: FieldEditProps) => {

  const [configFields, setConfigFields] = useState({});
  const [saveFail, setSaveFail] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleChange = (event: any) => {
    const fieldState = configFields;
  };

  useEffect(() => {

    const entries = Object.entries(fieldEditData)
    const fieldsState: any = {};
    entries.forEach(field => {
      fieldsState[field[0]] = field[1];
    });
    setConfigFields(fieldsState);
  }, []);

  const handleFieldEditSave = (event: any) => {
    event.preventDefault();
    setLoading(true);
    const data: any = {};
    data.column_name = event.target.form[1].value;
    data.data_type = event.target.form[2].value;
    console.log(data);
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
    }, 5000)
  };

  const handleDelete = (fieldEditData: any) => {
    console.log(fieldEditData);
  }

  const labels = ['Field Name', 'Data Type'];
  const reads = ['column_name', 'data_type'];
  const fields = Object.entries(fieldEditData).map((field, index) => {
    let selected = '';
    if (index === 1) selected = field[1]; 
    return index === 0
      ? (
        <div className='fieldViewSect'>
          <label className='fieldViewLabel' htmlFor={labels[index]}>{labels[index]}</label>
          <input className='fieldViewInput' style={{ color: 'black' }} type='text' id={field[1]} name={field[1]} value={configFields[reads[index]]} onChange={(e: any) => handleChange(e)} />
        </div>
      )
      : (
        <div className='fieldViewSect'>
          <label className='fieldViewLabel' htmlFor='dataType'>Data Type</label>
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
        <svg className='saveFieldSuccessSVG' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
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
          <div className='deleteEntrySVG' onClick={() => handleDelete(fieldEditData)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill='#bd5555'>
              <path d="M3 6v18h18v-18h-18zm5 14c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4-18v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712z"/>
            </svg>
          </div>
        </div>
        <div className='fieldEditBtnContainer'>
          {(loading || saveSuccess || saveFail)
             && loader
          }
          <button onClick={handleFieldEditSave} type='submit' form='fieldEditForm' className='fieldEditBtn'>Save</button>
        </div>
      </div>
      <form className='fieldEditForm' id='fieldEditForm'>
        {fields}
      </form>
    </div>
  );
};

export default FieldEdit;