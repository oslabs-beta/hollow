import { React, ReactDOM } from '../deps.ts';
import App from './components/App.tsx';

(ReactDOM as any).hydrate(
  <App />,
  //@ts-ignore
  document.getElementId('root')
);

