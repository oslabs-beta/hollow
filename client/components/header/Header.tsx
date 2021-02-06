import { React } from '../../../deps.ts'

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