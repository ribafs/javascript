// Saved Products
const getSavedProducts = () => {
  const productJson = localStorage.getItem('products');
  try {
    return productJson !== null ? JSON.parse(productJson) : [];
  } catch (error) {
    return [];
  }
};

// Save Products
const saveProducts = (products) => {
  localStorage.setItem('products', JSON.stringify(products));
};

// Sort
const sortProducts = (products, sortBy) => {
  if (sortBy === 'byEdited') {
    return products.sort((a, b) => {
      if (a.updated > b.updated) {
        return -1;
      } else if (a.updated < b.updated) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortBy === 'byCreated') {
    return products.sort((a, b) => {
      if (a.created > b.created) {
        return -1;
      } else if (a.created < b.created) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    return products;
  }
};

// Render Products
const renderProducts = (products, filters) => {
  ul.innerHTML = '';

  products = sortProducts(products, filters.sortBy);

  let filteredPrd = products.filter((item) =>
    item.title.toLowerCase().includes(filters.searchItem.toLowerCase())
  );

  if (document.querySelector('#existCheck').checked) {
    filteredPrd = filteredPrd.filter((item) => item.exist);
  }

  filteredPrd.forEach((product) => {
    ul.appendChild(createProductDOM(product));
  });

  saveProducts(products);
};

// Remove Product
const removeProduct = (id) => {
  const prdIndex = products.findIndex((item) => item.id === id);
  prdIndex > -1 && products.splice(prdIndex, 1);
};

// Toggle Existing
const toggleProduct = (id) => {
  products.forEach((item) => item.id === id && (item.exist = !item.exist));
};

// Create HTML Elements
const createProductDOM = (product) => {
  const productEl = document.createElement('li');
  const checkbox = document.createElement('input');
  const productItem = document.createElement('a');
  const removeBtn = document.createElement('button');
  const priceText = document.createElement('b');

  // card
  productEl.setAttribute(
    'class',
    'bg-white rounded overflow-hidden shadow-lg w-full product-card'
  );
  productEl.setAttribute('style', 'margin-bottom: 1rem; padding: 2rem');

  // exist status
  checkbox.setAttribute('type', 'checkbox');
  checkbox.checked = product.exist;
  checkbox.addEventListener('change', () => {
    toggleProduct(product.id);
    saveProducts(products);
    renderProducts(products, filters);
  });
  productEl.appendChild(checkbox);

  // title
  productItem.textContent = product.title;
  productItem.href = `./edit-product.html#${product.id}`;
  productEl.appendChild(productItem);

  // price
  priceText.textContent = 'Price: ' + product.price;
  productEl.appendChild(priceText);

  // remove btn
  removeBtn.textContent = 'Remove';
  removeBtn.setAttribute(
    'class',
    'bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full'
  );
  productEl.appendChild(removeBtn);
  removeBtn.addEventListener('click', () => {
    removeProduct(product.id);
    saveProducts(products);
    renderProducts(products, filters);
  });

  return productEl;
};

// Last Update Date
const lastUpdateDate = (timestamp) => {
  return `Last Update at ${moment(timestamp).locale('fa').fromNow()}`;
};
