import HomeScreen from './homeScreen.js';
import ProductScreen from './productScreen.js';
import { parseRequestUrl } from './utils.js';

const routes = {
  '/': HomeScreen,
  '/product/:id': ProductScreen,
};
const router = async () => {
  const request = parseRequestUrl();
  const parseUrl =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '');
  const screen = routes[parseUrl] ? routes[parseUrl] : Error404Screen;
  const main = document.getElementById('main-container');
  main.innerHTML = await HomeScreen.router();
};
window.addEventListener('load', router);
