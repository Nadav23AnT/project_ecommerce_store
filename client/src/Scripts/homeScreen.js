import data from './data';

const HomeScreen = {
  render: () => {
    const { products } = data;
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
