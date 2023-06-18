import data from '../Pages/data.js';

const HomeScreen = {
  render: async () => {
    const response = await fetch('https://localhost:5000/api/products', {
      headers: { 'Content-Type': 'application/JSON'  }
    });

    if (!response || !response.ok)
    {
      return '<div>Error in getting data</div>';
    }
    const products = await response.json();
    return `
        <ul class="products">
        ${products
          .map(
            (product) =>
              `
            <li>
                <div class="product">
                  <a href="../Pages/p1.html">
                   <img src="${product.image}" alt="product 1">
                  </a>
                <div class="product-name">
                 <a href="../Pages/products/${product._id}">
                    ${product.name}
                 </a>
                </div>
                <div class="product-brand">
                    ${product.brand}
                </div>
                <div class="product-price">
                  ${product.price}
                  </div>
                  </div>
            </li>
            `
          )
          .join('\n')}
        `;
  },
};
export default HomeScreen;
