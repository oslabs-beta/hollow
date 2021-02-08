// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react@16.13.1';

interface Props {
    text: string;
}

const Header: React.FC<Props> = () => {
    return (
        <div className='headerContainer'> 
            <h1 className='headerTextLeft'>Hello Left!</h1>
            <h1 className='headerTextRight'>Hello Right!</h1> 
        </div>
    )
}

export default Header