import productData from "./data.json" with {type : "json"};

const product = document.querySelector(".product");
const products = document.querySelector(".products");
const cart = document.getElementById("cart");

let productList = localStorage.getItem("products")
  ? JSON.parse(localStorage.getItem("products"))
  : [];
productList = productList.map((item) =>
  item
    ? {
        ...item,
        computeTotal: function () {
          this.total = this.quantity * this.price;
        },
      }
    : item
);

if (productList.length > 0) {
  cart.removeAttribute("hidden");
  cart.children[1].innerHTML = "";

  productList.forEach((product, index, arr) => {
    console.log(product);
    let template = `
            <li id="dummy-item">
              <h3 class="cart-product-title">${product.title}</h3>
              <div class="cart-stats">
                <div><span>${product.quantity}x</span><span>@${product.total}</span><span>${product.price}</span></div>
                <div><button data-title='${product.title}' class="cancel-cart">x</button></div>
              </div>
            </li>
          `;

    cart.children[1].innerHTML = cart.children[1].innerHTML + template;

    if (arr.length - 1 === index) {
      document
        .querySelectorAll(".cancel-cart")
        .forEach((item) => item.addEventListener("click", handleCancel));
    }
  });

  document.querySelector(".cart-empty").setAttribute("hidden", "hidden");
}

function addToCart(event) {
  console.log(event.currentTarget.dataset);

  const { title } = event.currentTarget.dataset;
  const [filteredProduct] = productData.filter((item) => item.name === title);
  console.log({ filteredProduct });
  const productItem = {
    ...filteredProduct,
    title: filteredProduct.name,
    quantity: 1,
    computeTotal: function () {
      this.total = this.quantity * this.price;
    },
    total: filteredProduct.price,
  };

  cart.removeAttribute("hidden");

  if (productList.length === 0) {
    productList.push(productItem);
  } else if (productList.filter((item) => item.title === title).length === 0) {
    productList.push(productItem);
  } else if (productList.filter((item) => item.title === title).length > 0) {
    // check if the item is an existing product  and update it
    productList = productList.map((item) => {
      if (item.title === title) {
        item.quantity = item.quantity + 1;
        item.computeTotal();
      }
      return item;
    });
  }

  localStorage.setItem("products", JSON.stringify(productList));
  console.log({ productList });

  cart.children[1].innerHTML = "";

  productList.forEach((product, index, arr) => {
    let template = `
            <li id="dummy-item">
              <h3 class="cart-product-title">${product.title}</h3>
              <div class="cart-stats">
                <div><span>${product.quantity}x</span><span>@${product.total}</span><span>${product.price}</span></div>
                <div><button data-title='${product.title}' class="cancel-cart">x</button></div>
              </div>
            </li>
          `;

    cart.children[1].innerHTML = cart.children[1].innerHTML + template;
    if (arr.length - 1 === index) {
      document
        .querySelectorAll(".cancel-cart")
        .forEach((item) => item.addEventListener("click", handleCancel));
    }
  });

  document.querySelector(".cart-empty").setAttribute("hidden", "hidden");
}

function showProduct(item, index, arr) {
  console.log(item);
  let productTemplate = `
          <div class="product">
            <div class="img-wrap">
              <picture>
                <source
                  media="(max-width : 768px) and (min-width : 541px)"
                  srcset=${item.image.tablet}
                />
                <source
                  media="(max-width : 540px)"
                  srcset=${item.image.mobile}
                />

                <img
                  src=${item.image.desktop}
                  alt="Waffle"
                />
              </picture>
              <button data-title='${item.name}' class="add-to-cart">
                <img
                  src=${"./assets/images/icon-add-to-cart.svg"}
                  alt="add to cart"
                />
                Add to Cart
              </button>
            </div>
            <div class="product-content-wrap">
              <h6 class="product-category">${item.category}</h6>
              <div class="product-title">${item.name}</div>
              <div class="product-price">$${item.price}</div>
            </div>
          </div>
  `;

  products.innerHTML = products.innerHTML + productTemplate;

  if (arr.length - 1 === index) {
    document
      .querySelectorAll(".add-to-cart")
      .forEach((item) => item.addEventListener("click", addToCart));
  }
}

productData.forEach(showProduct);

function handleCancel(event) {
  console.log("working");

  const { title } = event.currentTarget.dataset;
  productList = productList.filter(item => item.quantity > 0).map((item) => {
    if (item.title === title) {
      item.quantity = item.quantity - 1;
      item.computeTotal();
    }
    return item;
  });

 console.log({ productList });
  localStorage.setItem("products", JSON.stringify(productList.filter(item => item.quantity > 0)));
 

  cart.children[1].innerHTML = "";

  productList.filter(item => item.quantity > 0).forEach((product, index, arr) => {
    let template = `
            <li id="dummy-item">
              <h3 class="cart-product-title">${product.title}</h3>
              <div class="cart-stats">
                <div><span>${product.quantity}x</span><span>@${product.total}</span><span>${product.price}</span></div>
                <div><button data-title='${product.title}' class="cancel-cart">x</button></div>
              </div>
            </li>
          `;

    cart.children[1].innerHTML = cart.children[1].innerHTML + template;
    if (arr.length - 1 === index) {
      document
        .querySelectorAll(".cancel-cart")
        .forEach((item) => item.addEventListener("click", handleCancel));
    }
  });

  if (cart.children[1].innerHTML === ""){ document.querySelector(".cart-empty").removeAttribute("hidden"); cart.setAttribute("hidden", "hidden"); productList = [] }
}
