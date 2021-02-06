import React from 'https://dev.jspm.io/react@16.13.1';

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
      <button onClick={() => alert('HYDRATED')}>Hydration Button</button>
    </div>
  );
};

export default App;