// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react';

interface Props {
  text: string;
}

interface ItemType {
  type: string;
}

const ListItem: React.FC<ItemType> = ({ type }) => {

  

  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    alert('clickes');
    // if (active) {
      // setActive(false);
    // } else {
    //   setActive(true);
    // }
  };

  return (
      <div onClick={handleClick} className='sidebarItem'>
        <p className='active'>{type}</p>
      </div>
  );
};

interface HeaderType {
  type: string;
}

const ListHeader: React.FC<HeaderType> = ({ type }) => {
  return (
    <div>
      <p className='sidebarListHeader'>{type}</p>
    </div>
  );
}


const Sidebar: React.FC<Props> = () => {
const [active, setActive] = React.useState<boolean>(false);
const activeCollections = ['Users', 'Reviews', 'Likes'];

const collections = activeCollections.map(collection => {
  return (<ListItem type={collection} />);
});

  return (
    <div className='sidebarContainer'>
      <div className='sidebarLogo'>
        hollow
      </div>
      <ListHeader type='Collections'/>
        {collections}
      <ListHeader type='Tools' />
        <ListItem type='Content-Builder' />
        <ListItem type='Plugins' />
      <div className='sidebarSettings'>
        <h3>Settings</h3>
      </div>
    </div>
  );
};

export default Sidebar;