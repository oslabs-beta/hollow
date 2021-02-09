import { h } from 'https://unpkg.com/preact@10.5.12?module';

interface Props {
  text: string;
}

const Header = () => {
  return (
    <div className='headerContainer'> 
      <h1 className='headerTextLeft'>Hello Left!</h1>
      <h1 className='headerTextRight'>Hello Right!</h1> 
    </div>
  )
}

export default Header