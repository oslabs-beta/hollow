// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from 'https://dev.jspm.io/react';
import ReactDOM from 'https://dev.jspm.io/react';

import App from './components/App.tsx';

(ReactDOM as any).hydrate(
  <App />,
  //@ts-ignore
  document.getElementById('root')
);

