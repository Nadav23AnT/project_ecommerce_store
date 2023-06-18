import HomeScreen from './homeScreen.js';
import Error404Screen from './error404Screen.js';
import ProductScreen from './productScreen.js';
import { parseRequestUrl } from './utils.js';

const routes = {
  '/': HomeScreen,
  '/product/:id': ProductScreen,
};
const router = () => {
  const request = parseRequestUrl();
  const parseUrl =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '');
  const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
  // eslint-disable-next-line no-console
  console.log(screen);
  const main = document.getElementById('main-container');
  main.innerHTML = HomeScreen.router();
};
window.addEventListener('load', router);
