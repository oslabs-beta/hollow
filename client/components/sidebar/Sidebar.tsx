import { React } from '../../../deps.ts';


interface Props {
  text: string;
}


interface ItemType {
  type: string;
  active: string;
  handleClick: React.MouseEventHandler<HTMLDivElement>;
}

const ListItem: React.FC<ItemType> = ({ type, active, handleClick }) => {
  return (
      <div onClick={handleClick} className='sidebarItem'>
        <p className={active}>{type}</p>
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
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    console.log('here');
    alert('clickeddd!!');
    e.preventDefault();
  };
  return (
    <div className='sidebarContainer'>
      <div className='sidebarLogo'>
        hollow
      </div>
      <ListHeader type='Collections'/>
        <ListItem handleClick={handleClick} active='active' type='Users' />
        <ListItem handleClick={handleClick} active='inactive' type='Reviews' />
        <ListItem handleClick={handleClick} active='inactive' type='Likes' />
      <ListHeader type='Tools' />
        <ListItem handleClick={handleClick} active='inactive' type='Content-Builder' />
        <ListItem handleClick={handleClick} active='inactive' type='Plugins' />
      <div className='sidebarSettings'>
        <h3>Settings</h3>
      </div>
    </div>
  );
};

export default Sidebar;