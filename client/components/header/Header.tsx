import { h } from 'https://unpkg.com/preact@10.5.12?module';
import SearchBar from  './searchBar.tsx'

const Header = () => {
  return (
    <div className='headerContainer'> 
      <SearchBar />
      <h1 className='headerTextRight'></h1> 
    </div>
  )
};

export default Header;