import { React } from '../../../deps.ts';
import * as style from './style.ts';

const Sidebar = () => {
  return (
    <div style={style.container} >
      <ul style={style.list} >
        <li>Collections
          <ul style={style.inner}>
            <li>Users</li>
          </ul>
        </li>
        <li>Tools
          <ul style={style.inner}>
            <li>Content-Builder</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;