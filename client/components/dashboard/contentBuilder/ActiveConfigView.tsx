import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';
import * as helpers from './activeConfigHelpers.tsx';
import AddNewCollection from './AddNewCollection.tsx';
import FieldPopup from './FieldPopup.tsx';
import FieldEdit from './FieldEdit.tsx';

interface ActiveConfigProps {
  type: string;
  handleActiveChange: (activeItem: string) => void;
  refreshCollections: () => void;
  activeConfigFields: string[][];
  refreshConfigView: () => void;
  handleFieldClick: (event: any) => void;
  fieldEditActive: boolean;
  fieldEditData: object;
}

const ActiveConfigView = ({ type, refreshCollections, handleActiveChange, activeConfigFields, refreshConfigView, handleFieldClick, fieldEditActive, fieldEditData }: ActiveConfigProps) => {


  const [fieldPopupActive, setFieldPopupActive] = useState(false);
  
  const activeFields = activeConfigFields.map((field, index) => {
    return (
      <helpers.Entry handleFieldClick={handleFieldClick} values={field} index={index} />
    );
  });

  const handleFieldPopup = () => {
    if (fieldPopupActive) setFieldPopupActive(false);
    else setFieldPopupActive(true);
  }

  const handleFieldPopupSuccess = () => {
    refreshConfigView();
    setFieldPopupActive(false);
  }



  return (
    <div className='activeConfigContainer'>
      {type === 'Add New Collection'
        ? <AddNewCollection handleActiveChange={handleActiveChange} refreshCollections={refreshCollections} />
       : fieldEditActive
            ? <FieldEdit activeConfigFields={activeConfigFields} fieldEditData={fieldEditData} />
            : (
              <div>
          <div className='activeCollectionHeader'>
            <div className='activeCollectionDetails'>
              <p className='activeCollectionName'>Collection</p>
              <p className='activeCollectionCount'>3 fields found</p>
            </div>
            <button onClick={handleFieldPopup} className='addEntryBtn' id='addNewEntryBtn'>Add New Field</button>
          </div>
          <div className='activeTableContainer'>
          <table className='activeCollectionTable'>
            <thead>
              <th 
                scope='col'
                className='activeCollectionFieldName'
              >
                Name
              </th>
              <th 
                scope='col'
                className='activeCollectionFieldName'
              >
                Data Type
              </th>
            </thead>
            <tbody>
              {activeFields}
            </tbody>
          </table>
          {fieldPopupActive &&
            <FieldPopup handleFieldPopupSuccess={handleFieldPopupSuccess} />
          }
          </div>
        </div>
            )
        }
    </div>
  );
}

export default ActiveConfigView;