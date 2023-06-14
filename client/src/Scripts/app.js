import HomeScreen from './homeScreen.js'
const router = () => { 
  const main = document.getElementById('main-container');
  main.innerHTML = HomeScreen.router();
}
window.addEventListener("load", router);