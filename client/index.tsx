// import preact
import { h, hydrate } from 'https://unpkg.com/preact@10.5.12?module';

// import components
import App from './components/App.tsx';

/******************************************************************************************* */

// @ts-ignore
hydrate(<App />, document.getElementById("root"));
