// @deno-types="https://raw.githubusercontent.com/Soremwar/deno_types/master/react/v16.13.1/react.d.ts"
import React from "https://cdn.pika.dev/react@16.13.1";
import ReactDOM from "https://cdn.pika.dev/react@16.13.1";

import App from './components/App.tsx';

(ReactDOM as any).hydrate(
  <App />,
  //@ts-ignore
  document.getElementId('root')
);

