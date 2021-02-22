import { h } from 'https://unpkg.com/preact@10.5.12?module';
import { useState, useEffect } from 'https://unpkg.com/preact@10.5.12/hooks/dist/hooks.module.js?module';
import { ContentBuilderProps, FieldRowProps, FormMessageProps } from './interface.ts';
import * as helpers from './sidebarHelpers.tsx';
import ActiveConfigView from './ActiveConfigView.tsx';

/**
 * @description Renders Content-Builder panel to create collections
 * @param refreshCollections Re-renders sidebar to include newly added collection
 */

 const ContentBuilder = ({ refreshCollections, handleActiveChange, currentCollections }: ContentBuilderProps) => {
  //  
  const [activeConfig, setActiveConfig] = useState('beers');
  const [activeConfigFields, setActiveConfigFields] = useState([[]]);
  const [fieldEditActive, setFieldEditActive] = useState(false);
  const [fieldEditData, setFieldEditData] = useState({});

  const handleCollectionConfig = (event: any) => {
    console.log(event.target.classList[0]);
    let text;
    if (event.target.innerText === '+ Add New Collection') text = 'Add New Collection';
    else if (event.target.classList[0] === 'contentBuilderSidebarTool') text = 'Add New Collection';
    else text = event.target.innerText;
    setActiveConfig(text);
  };

  const handleFieldClick = (event: any) => {
    console.log(event.target);
    if (fieldEditActive) {
      setFieldEditActive(false);
      setFieldEditData({});
    } else if (event.target.nodeName === 'TD') {
      console.log(event.target);
      setFieldEditActive(true);
      const data: any = {};
      const name = event.target.parentElement.children[0].textContent;
      const type = event.target.parentElement.children[1].textContent;
      data.column_name = name;
      data.data_type = type;
      setFieldEditData(data);
    }
  }

  useEffect(() => {
    if (activeConfig !== 'Add New Collection') {
      fetch(`/api/tables/${activeConfig}`)
      .then(data => data.json())
      .then(res => {
        console.log(res);
        const activeFields = res.data.columns.map((field: any) => {
          return [field.column_name, field.data_type];
        })

        setActiveConfigFields(activeFields);

      })
      .catch(error => console.log('error', error));
    }
    
  }, [activeConfig]);

  const refreshConfigView = () => {
    const copy = activeConfig;
    setActiveConfig('');
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
        {collections}
        <div 
          onClick={(e: any) => handleCollectionConfig(e)} 
          className={`contentBuilderSidebarTool ${activeConfig === 'Add New Collection' ? 'contentBuilderSidebarToolActive' : 'inactive'}`}
        >
          <p className='contentBuilderAddCollectionPlus '>+</p>
          <p>Add New Collection</p>
        </div>
      </div>
      <ActiveConfigView 
        type={activeConfig} 
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