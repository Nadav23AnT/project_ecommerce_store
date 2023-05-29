// Function to display products
function displayProducts() {
  const productContainer = document.querySelector('main');
  
  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.classList.add('product', 'slide-in');
    
    productElement.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h2>${product.name}</h2>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    
    productContainer.appendChild(productElement);
  });

  const header = document.querySelector('header');
  header.classList.add('fade-in');
}
