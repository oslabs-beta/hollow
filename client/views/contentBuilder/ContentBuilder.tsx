// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';

// import components
import * as helpers from './sidebarHelpers.tsx';
import ActiveConfigView from './ActiveConfigView.tsx';

// import type definitions
import { ContentBuilderProps } from './interface.ts';

/******************************************************************************************* */

/**
 * @description this component renders the Content-Builder view to allow user to 
 * create collections and edit or add fields to collections. 
 * 
 * @param refreshCollections - function which makes a request to get current collections 
 * and force rerender of collections in sidebar
 * 
 * @param handleActiveChange - function which forces update of active collection
 * 
 * @param currentCollections - an array containing the current collections
 */

 const ContentBuilder = ({ 
   refreshCollections, 
   handleActiveChange, 
   currentCollections }: ContentBuilderProps) => {

  // holds the selected collection in content-builider sidebar 
  // - defaults to first element in currentCollections
  const [activeConfig, setActiveConfig] = useState(currentCollections[0]);

  // holds an array of arrays - with each nested array containing the active 
  // fields for the selected collecitons fields
  const [activeConfigFields, setActiveConfigFields] = useState([[]]);

  // holds a boolean which determines whether or not to display the field edit view
  // display field edit (true) hide field edit (false)
  const [fieldEditActive, setFieldEditActive] = useState(false);

  // holds an object which contains the field data for selected fields
  const [fieldEditData, setFieldEditData] = useState({});

  /******************************************************************************************* */

  // invoked when updates to activeConfig are recognized
  // 
  useEffect(() => {

    // if currentCollections is empty, meaning there are no active collections, return out of hook
    if (!currentCollections.length) return;

    // activeConfig will be 'Add New Collection', when add new collection button is clicked in sidebar, 
    // else it will be one of the active collections
    //
    // if activeConfig is a collection, a request is made to get that collections data
    // and the response is parsed and saved in setActiveConfigFields state as an array of arrays,
    // containing two elements, field name & data type
    if (activeConfig !== 'Add New Collection') {
      fetch(`/api/tables/${activeConfig}`)
      .then(data => data.json())
      .then(res => {
        const activeFields = res.data.columns.map((field: any) => {
          return [field.column_name, field.data_type];
        })

        setActiveConfigFields(activeFields);

      })
      .catch(error => console.log('error', error));
    }
    
  }, [activeConfig]);

  // function which handles setting the correct activeconfig based on 
  // the event target that was clicked
  const handleCollectionConfig = (event: any) => {
    let text;
    if (event.target.innerText === '+ Add New Collection') text = 'Add New Collection';
    else if (event.target.classList[0] === 'contentBuilderSidebarTool') text = 'Add New Collection';
    else text = event.target.innerText;
    setActiveConfig(text);
  };

  // function which handles clicks on individual fields and sets the fieldEditData to reflect
  // the data that is in the event target of the clicked element
  const handleFieldClick = (event: any) => {
    if (fieldEditActive) {
      setFieldEditActive(false);
      setFieldEditData({});
    } else if (event.target.nodeName === 'TD') {
      setFieldEditActive(true);
      const data: any = {};
      const name = event.target.parentElement.children[0].textContent;
      const type = event.target.parentElement.children[1].textContent;
      data.column_name = name;
      data.data_type = type;
      setFieldEditData(data);
    }
  }

  // function which is used to force a rerender of the fields view of any 
  // individual collection
  const refreshConfigView = () => {
    const copy = activeConfig.slice();
    setActiveConfig(copy);
  };


  // maps each collection to List item and renders below
  const collections = currentCollections.map((collection, i) => {
    let active = false;
    if (collection === activeConfig) active = true;
    return (
    <helpers.ListItem 
      type={collection} 
      handleCollectionConfig={handleCollectionConfig} 
      active={active} 
      handleFieldClick={handleFieldClick} 
    />
    );
  });

  return (
    <div className='contentBuilderContainer'>
      <div className='contentBuilderSidebar'>
        <div className='contentBuilderSidebarCollections'>
          {collections}
        </div>
        <div 
          onClick={(e: any) => handleCollectionConfig(e)}
          // set the className of the add new collection tool to
          // either active or inactive depending on if its been clicked or not
          className={`contentBuilderSidebarTool ${activeConfig === 'Add New Collection' ? 'contentBuilderSidebarToolActive' : 'inactive'}`}
        >
          <p className='contentBuilderAddCollectionPlus '>+</p>
          <p>Add New Collection</p>
        </div>
      </div>
      <ActiveConfigView 
        handleFieldClick={handleFieldClick} 
        fieldEditActive={fieldEditActive} 
        refreshConfigView={refreshConfigView} 
        refreshCollections={refreshCollections} 
        handleActiveChange={handleActiveChange} 
        activeConfigFields={activeConfigFields}
        fieldEditData={fieldEditData}
        activeConfig={activeConfig}
      />
    </div>
  );
}


export default ContentBuilder;