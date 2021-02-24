// import preact
import { h } from 'https://unpkg.com/preact@10.5.12?module';

// import components
import SearchBar from  './SearchBar.tsx'

/******************************************************************************************* */

/**
 * @description this component renders the header which stays fixed at the top of the page
 * The search bar allows for searching through the database or selected collection
 * 
 * @note the functionality for building the search bar has not been built out yet
 */

const Header = () => {
  return (
    <div className='headerContainer'> 
      <SearchBar />
      <h1 className='headerTextRight'></h1> 
    </div>
  )
};

export default Header;