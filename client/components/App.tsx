import { React, ReactDOMServer } from '../../deps.ts';
import Sidebar from './sidebar/Sidebar.tsx';
import Header from './header/Header.tsx'



const App: React.FC = () => {
  return (
    <div>
      <Sidebar text='hi' />
      <Header text='hi' />
    </div>
  );
};

export default App;
