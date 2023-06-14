import HomeScreen from './homeScreen.js'
import ProductScreen from './productScreen.js';

const routes = {
  "/": HomeScreen,
  "/product/:id": ProductScreen,
}
const router = () => { 
  const main = document.getElementById('main-container');
  main.innerHTML = HomeScreen.router();
}
window.addEventListener("load", router);