import { React } from '../../deps.ts';
import Sidebar from './sidebar/Sidebar.tsx';
import Header from './header/Header.tsx'

const App: React.FC = () => {
  return (
    <>
      <Sidebar text='hi' />
      <Header text='hi' />
    </>
  );
};

export default App;