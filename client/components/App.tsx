// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from "https://cdn.pika.dev/react@16.13.1";

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
