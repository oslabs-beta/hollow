import { React } from '../../../deps.ts';

interface Props {
    text: string;
}

const Header: React.FC<Props> = () => {
    return (
        <div> 
            hello!
        </div>
    )
}

export default Header