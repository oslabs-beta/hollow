import { React } from "../../deps.ts";
import Sidebar from './sidebar/Sidebar.tsx';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

const App = () => {
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default App;