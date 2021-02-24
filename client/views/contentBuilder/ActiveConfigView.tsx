// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

// import components
import * as helpers from './activeConfigHelpers.tsx';
import AddNewCollection from './AddNewCollection.tsx';
import FieldPopup from './FieldPopup.tsx';
import FieldEdit from './FieldEdit.tsx';

// import type definitions
import { ActiveConfigProps } from './interface.ts';

/******************************************************************************************* */

/**
 * @description - this component renders the currently selected view to the screen based on what
 * item is clicked in the content builder sidebar
 * 
 * @param refreshCollections - a function used to force a rerender of the active collections, 
 * to reflect any changes that may have been made
 * 
 * @param handleActiveChange - function which forces update of active collection
 * 
 * @param activeConfigFields - an array of arrays, with each array containing two elements -
 * the selected collections field name and data type
 * 
 * @param refreshConfigView - a function which is used to make a new request to get any newly added or
 * edited fields for the selected collection. This forces an update and rerender to reflect those new changes
 * 
 * @param handleFieldClick - a function which is used in this component to set the view to show all
 * fields for a collection when an individual field is deleted
 * 
 * @param fieldEditActive - a boolean which determines whether or not the field edit view should
 *  be displayed on screen
 * 
 * @param fieldEditData - an object containing all of the selected collections field data
 * 
 * @param activeConfig - a string containing the selected content builder sidebar item
 */

const ActiveConfigView = ({ 
  refreshCollections, 
  handleActiveChange, 
  activeConfigFields, 
  refreshConfigView, 
  handleFieldClick, 
  fieldEditActive, 
  fieldEditData, 
  activeConfig }: ActiveConfigProps) => {


  // holds a boolean which determines whether or not the create new field
  // popup should be displayed on screen
  // open (true) closed (false) - defaults to false
  const [fieldPopupActive, setFieldPopupActive] = useState(false);

  /******************************************************************************************* */
  
  // function which handles setting the correct state of the fieldPopupActive boolean

  const handleFieldPopup = () => {
    if (fieldPopupActive) setFieldPopupActive(false);
    else setFieldPopupActive(true);
  }

  // function which handles a successful request to add a new field to
  // selected collection.
  //
  // sets the fieldActivePopup to false, closing it, and invokes a refresh of
  // the fields view

  const handleFieldPopupSuccess = () => {
    setTimeout(() => {
      refreshConfigView();
      setFieldPopupActive(false);
    }, 1000)
  }

  // function which handles closing the new field popup on click of cancel

  const handleFieldPopupclose = () => {
    setFieldPopupActive(false);
  };

  // maps the selected coolections fields to activeFields variable
    
  const activeFields = activeConfigFields.map((field, index) => {
    return (
      <helpers.Entry handleFieldClick={handleFieldClick} values={field} index={index} />
    );
  });

  return (
    <div className='activeConfigContainer'>
      {/* if activeConfig is 'Add New Collection, render
        * the Add New Collection component
      */}
      {activeConfig === 'Add New Collection'
        ? <AddNewCollection 
            handleActiveChange={handleActiveChange} 
            refreshCollections={refreshCollections} 
          />
          // if fieldEditActive is true, render the field edit component
       : fieldEditActive
            ? <FieldEdit
                handleFieldClick={handleFieldClick}
                fieldEditData={fieldEditData}
                activeConfig={activeConfig}
                refreshConfigView={refreshConfigView} 
              />
              // if activeConfig is not 'Add New Collection'
              // and fieldEditActive is false, render the activeConfigView
              // which displays the table of all active fields in selected
              // collection and allows for interaction
            : (
              <div>
          <div className='activeCollectionHeader'>
            <div className='activeCollectionDetails'>
              <p className='activeCollectionName'>Collection</p>
              <p className='activeCollectionCount'>3 fields found</p>
            </div>
            <button
              onClick={handleFieldPopup}
              className='addEntryBtn'
              id='addNewEntryBtn'>
              Add New Field
            </button>
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
          {/* if fieldPopupActive is true, render the field popup to screen */}
          {fieldPopupActive &&
            <FieldPopup
              handleFieldPopupclose={handleFieldPopupclose}
              handleFieldPopupSuccess={handleFieldPopupSuccess}
              activeConfig={activeConfig} 
            />
          }
          </div>
        </div>
            )
        }
    </div>
  );
}

export default ActiveConfigView;