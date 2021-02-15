import { h, hydrate } from 'https://unpkg.com/preact@10.5.12?module';
import App from './components/App.tsx';
// @ts-ignore
hydrate(<App />, document.getElementById("root"));
