const prdTitle = document.querySelector('#product_title');
const prdPrice = document.querySelector('#product_price');
const removeBtn = document.querySelector('#remove_btn');
const lastEditDate = document.querySelector('#last_edit');

let products = getSavedProducts();

const prdId = location.hash.substring(1);

let product = products.find((item) => {
  return item.id == prdId;
});

if (product === undefined) {
  location.assign('./index.html');
}

prdTitle.value = product.title;
prdPrice.value = product.price || 0;

lastEditDate.textContent = lastUpdateDate(product.updated);

document.querySelector('h1').textContent += `: ${product.title}`;

document.title = 'Edit: ' + product.title;

prdTitle.addEventListener('input', (e) => {
  product.title = e.target.value;
  product.updated = moment().valueOf();
  lastEditDate.textContent = lastUpdateDate(product.updated);
  saveProducts(products);
});

prdPrice.addEventListener('input', (e) => {
  product.price = e.target.value;
  product.updated = moment().valueOf();
  lastEditDate.textContent = lastUpdateDate(product.updated);
  saveProducts(products);
});

removeBtn.addEventListener('click', () => {
  removeProduct(product.id);
  saveProducts(products);
  location.assign('./index.html');
});

// Live Change
window.addEventListener('storage', (e) => {
  if (e.key === 'products') {
    products = JSON.parse(e.newValue);

    product = products.find((item) => {
      return item.id == prdId;
    });

    if (product === undefined) {
      location.assign('./index.html');
    }

    prdTitle.value = product.title;
    prdPrice.value = product.price || 0;
    lastEditDate.textContent = lastUpdateDate(product.updated);
  }
});
