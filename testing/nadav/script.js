// Sample product data
const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 10,
    image: 'product1.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 2,
    name: 'Product 2',
    price: 20,
    image: 'product2.jpg',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  // Add more products as needed
];

// Function to display products
function displayProducts() {
  const productContainer = document.querySelector('main');
  
  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    
    productContainer
