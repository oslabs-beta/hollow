import { React } from "../../deps.ts";

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
      This is a test.
    </div>
  );
};

export default App;