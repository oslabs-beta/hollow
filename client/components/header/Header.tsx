<<<<<<< HEAD
// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';
import SearchBar from './SearchBar.tsx'

const Header: React.FC<Props> = () => {
    return (
        <div className='headerContainer'>
            <SearchBar/>
            <h1 className='headerTextRight'>Hello Right!</h1>
        </div>
    )
}

export default Header
=======
import { h } from 'https://unpkg.com/preact@10.5.12?module';

const Header = () => {
  return (
    <div className='headerContainer'> 
      <h1 className='headerTextLeft'>Hello Left!</h1>
      <h1 className='headerTextRight'>Hello Right!</h1> 
    </div>
  )
};

export default Header;
>>>>>>> 5f9a224451395d1e9b3f5098395de357490cfdf3
