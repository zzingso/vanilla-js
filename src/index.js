import './index.scss';
import './css/todo.scss';

import { init } from "./js/todo/todo.js";

init();

if (module.hot) {
  module.hot.accept();
}