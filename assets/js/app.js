const STORAGE_KEYS = {
  products: 'luxethreads_products_v1',
  cart: 'luxethreads_cart_v1',
  orders: 'luxethreads_orders_v1',
  settings: 'luxethreads_settings_v1'
};

const ORDER_STATUSES = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const DEFAULT_PRODUCTS = [
  {
    id: 'LX-101',
    name: 'Merino Wool Double-Breasted Blazer',
    category: 'mens',
    price: 11990,
    originalPrice: 13990,
    image: 'https://images.pexels.com/photos/5325633/pexels-photo-5325633.jpeg',
    badge: 'New in',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'LX-102',
    name: 'Silk Blend Wrap Dress',
    category: 'womens',
    price: 8990,
    originalPrice: 9990,
    image: 'https://images.pexels.com/photos/6311399/pexels-photo-6311399.jpeg',
    badge: 'Limited',
    createdAt: Date.now() - 1000 * 60 * 60 * 5
  },
  {
    id: 'LX-103',
    name: 'Italian Leather Weekender',
    category: 'accessories',
    price: 7490,
    originalPrice: 8490,
    image: 'https://images.pexels.com/photos/6311667/pexels-photo-6311667.jpeg',
    badge: 'Bestseller',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6
  },
  {
    id: 'LX-104',
    name: 'Cashmere Crew Neck Sweater',
    category: 'mens',
    price: 5790,
    originalPrice: 6190,
    image: 'https://images.pexels.com/photos/6796571/pexels-photo-6796571.jpeg',
    badge: 'Editors Choice',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'LX-105',
    name: 'Satin Trench Coat',
    category: 'womens',
    price: 9990,
    originalPrice: 11290,
    image: 'https://images.pexels.com/photos/5886041/pexels-photo-5886041.jpeg',
    badge: 'Back in stock',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  },
  {
    id: 'LX-106',
    name: 'Heritage Leather Sneakers',
    category: 'mens',
    price: 6490,
    originalPrice: 6990,
    image: 'https://images.pexels.com/photos/6311396/pexels-photo-6311396.jpeg',
    badge: 'Comfort',
    createdAt: Date.now() - 1000 * 60 * 60 * 12
  },
  {
    id: 'LX-107',
    name: 'Pearl Studded Evening Bag',
    category: 'accessories',
    price: 5590,
    originalPrice: 6190,
    image: 'https://images.pexels.com/photos/5632373/pexels-photo-5632373.jpeg',
    badge: 'Occasion',
    createdAt: Date.now() - 1000 * 60 * 60 * 48
  },
  {
    id: 'LX-108',
    name: 'Tailored Linen Co-ord Set',
    category: 'womens',
    price: 7490,
    originalPrice: 7890,
    image: 'https://images.pexels.com/photos/7323791/pexels-photo-7323791.jpeg',
    badge: 'Summer',
    createdAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 'LX-109',
    name: 'Suede Chelsea Boots',
    category: 'mens',
    price: 8290,
    originalPrice: 9490,
    image: 'https://images.pexels.com/photos/4098273/pexels-photo-4098273.jpeg',
    badge: 'Handcrafted',
    createdAt: Date.now() - 1000 * 60 * 60 * 18
  }
];

const TRACKING_CARRIERS = [
  'Delhivery Premier',
  'Blue Dart Priority',
  'Ecom Express Elite',
  'Shadowfax Luxe'
];

const OWNER_PORTAL_URL = 'admin.html#owner';

const state = {
  products: [],
  cart: [],
  orders: [],
  settings: null,
  filters: {
    category: 'all',
    sort: 'featured'
  }
};

const elements = {
  year: document.getElementById('year'),
  navToggle: document.getElementById('navToggle'),
  navMenu: document.getElementById('navMenu'),
  productGrid: document.getElementById('productGrid'),
  cartCount: document.getElementById('cartCount'),
  cartDrawer: document.getElementById('cartDrawer'),
  openCart: document.getElementById('openCart'),
  closeCart: document.getElementById('closeCart'),
  payNowBtn: document.getElementById('payNowBtn'),
  cartItems: document.getElementById('cartItems'),
  cartSubtotal: document.getElementById('cartSubtotal'),
  clearCart: document.getElementById('clearCart'),
  checkoutBtn: document.getElementById('checkoutBtn'),
  checkoutModal: document.getElementById('checkoutModal'),
  checkoutForm: document.getElementById('checkoutForm'),
  trackingModal: document.getElementById('trackingModal'),
  trackingContent: document.getElementById('trackingContent'),
  ordersList: document.getElementById('ordersList'),
  refreshOrders: document.getElementById('refreshOrders'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortFilter: document.getElementById('sortFilter'),
  toast: document.getElementById('toast')
};

let pendingCheckout = null;

const utils = {
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return structuredClone(fallback);
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Failed to load ${key}`, error);
      return structuredClone(fallback);
    }
  },
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save ${key}`, error);
    }
  },
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  },
  randomId(prefix = 'ORD') {
    return `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-4)}`;
  },
  closeElement(el) {
    el?.classList.remove('open');
    el?.setAttribute('aria-hidden', 'true');
  },
  openElement(el) {
    el?.classList.add('open');
    el?.setAttribute('aria-hidden', 'false');
  },
  showToast(message, variant = 'default') {
    if (!elements.toast) return;
    elements.toast.textContent = message;
    elements.toast.dataset.variant = variant;
    elements.toast.classList.add('show');
    setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }
};

function generateTrackingDetails() {
  const now = Date.now();
  const carrier = TRACKING_CARRIERS[Math.floor(Math.random() * TRACKING_CARRIERS.length)];
  const trackingId = `LUX${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString().slice(-3)}`;
  const offsetHours = [0, 3, 20, 44, 60];
  const statusUpdates = {};
  const eta = {};

  ORDER_STATUSES.forEach((status, index) => {
    const offset = offsetHours[index] ?? index * 18;
    const timestamp = new Date(now + offset * 60 * 60 * 1000).toISOString();
    eta[status] = timestamp;
    statusUpdates[status] = index === 0 ? new Date(now).toISOString() : null;
  });

  return {
    statusUpdates,
    tracking: {
      id: trackingId,
      carrier,
      estimatedDelivery: eta['Delivered'],
      eta
    }
  };
}

function init() {
  hydrateState();
  bindEvents();
  renderAll();
}

function hydrateState() {
  const storedProducts = utils.load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  const storedCart = utils.load(STORAGE_KEYS.cart, []);
  const storedOrders = utils.load(STORAGE_KEYS.orders, []);
  const storedSettings = utils.load(STORAGE_KEYS.settings, null);

  if (!storedProducts.length) {
    utils.save(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    state.products = structuredClone(DEFAULT_PRODUCTS);
  } else {
    state.products = storedProducts;
  }

  state.cart = storedCart;
  state.orders = storedOrders;
  state.settings = storedSettings;

  if (elements.year) {
    elements.year.textContent = new Date().getFullYear();
  }
}

function bindEvents() {
  elements.navToggle?.addEventListener('click', () => {
    elements.navMenu?.classList.toggle('open');
  });

  elements.navMenu?.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      elements.navMenu.classList.remove('open');
    }
  });

  elements.openCart?.addEventListener('click', () => toggleCart(true));
  elements.closeCart?.addEventListener('click', () => toggleCart(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleCart(false);
      closeAllModals();
    }
  });

  document.addEventListener('keydown', handleOwnerShortcut);

  elements.payNowBtn?.addEventListener('click', () => openCheckout());

  elements.productGrid?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) return;
    const { productId } = button.dataset;
    handleAddToCart(productId);
  });

  elements.cartItems?.addEventListener('click', (event) => {
    const action = event.target.closest('[data-cart-action]');
    if (!action) return;
    const { cartAction, productId } = action.dataset;
    if (cartAction === 'remove') {
      updateCartItem(productId, 0);
    }
    if (cartAction === 'increase') {
      updateCartItem(productId, getCartQuantity(productId) + 1);
    }
    if (cartAction === 'decrease') {
      updateCartItem(productId, getCartQuantity(productId) - 1);
    }
  });

  elements.clearCart?.addEventListener('click', () => {
    if (!state.cart.length) {
      utils.showToast('Your cart is already empty.');
      return;
    }
    state.cart = [];
    persistCart();
    renderCart();
    utils.showToast('Cart cleared.');
  });

  elements.checkoutBtn?.addEventListener('click', () => openCheckout());

  document.querySelectorAll('[data-close-modal]')?.forEach((btn) => {
    btn.addEventListener('click', () => closeAllModals());
  });

  elements.checkoutForm?.addEventListener('submit', handleCheckoutSubmit);

  elements.ordersList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-track-order]');
    if (!button) return;
    const { orderId } = button.dataset;
    openTracking(orderId);
  });

  elements.refreshOrders?.addEventListener('click', () => {
    state.orders = utils.load(STORAGE_KEYS.orders, []);
    renderOrders();
    utils.showToast('Orders refreshed.');
  });

  elements.categoryFilter?.addEventListener('change', (event) => {
    state.filters.category = event.target.value;
    renderProducts();
  });

  elements.sortFilter?.addEventListener('change', (event) => {
    state.filters.sort = event.target.value;
    renderProducts();
  });

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEYS.products) {
      state.products = utils.load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
      renderProducts();
    }
    if (event.key === STORAGE_KEYS.orders) {
      state.orders = utils.load(STORAGE_KEYS.orders, []);
      renderOrders();
    }
  });
}

function renderAll() {
  renderProducts();
  renderCart();
  renderOrders();
}

function renderProducts() {
  if (!elements.productGrid) return;

  const products = applyFilters(state.products, state.filters);

  if (!products.length) {
    elements.productGrid.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-face-frown"></i>
        <p>No products found for the selected filters.</p>
      </div>
    `;
    return;
  }

  const markup = products.map((product) => {
    const { id, name, price, originalPrice, image, badge } = product;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `
      <article class="product-card">
        <img src="${image}" alt="${name}">
        <div>
          <div class="badge"><i class="fa-solid fa-star"></i> ${badge}</div>
        </div>
        <div>
          <h3>${name}</h3>
          <p>Complimentary alterations - Sustainable fabrics</p>
        </div>
        <div class="price-row">
          <strong>${utils.formatCurrency(price)}</strong>
          <span class="subtitle">MRP <s>${utils.formatCurrency(originalPrice)}</s> - ${discount}% off</span>
        </div>
        <button class="btn btn--primary" data-add-to-cart data-product-id="${id}">
          <i class="fa-solid fa-cart-plus"></i> Add to Cart
        </button>
      </article>
    `;
  }).join('');

  elements.productGrid.innerHTML = markup;
}

function applyFilters(products, filters) {
  let filtered = [...products];

  if (filters.category !== 'all') {
    filtered = filtered.filter((product) => product.category === filters.category);
  }

  switch (filters.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      filtered.sort((a, b) => a.id.localeCompare(b.id));
  }

  return filtered;
}

function handleAddToCart(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) {
    utils.showToast('Unable to add this product right now.', 'error');
    return;
  }

  const existing = state.cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  persistCart();
  renderCart();
  utils.showToast(`${product.name} added to your cart.`);
}

function getCartQuantity(productId) {
  return state.cart.find((item) => item.id === productId)?.quantity ?? 0;
}

function updateCartItem(productId, quantity) {
  const item = state.cart.find((entry) => entry.id === productId);
  if (!item) return;

  if (quantity <= 0) {
    state.cart = state.cart.filter((entry) => entry.id !== productId);
  } else {
    item.quantity = quantity;
  }

  persistCart();
  renderCart();
}

function persistCart() {
  utils.save(STORAGE_KEYS.cart, state.cart);
}

function renderCart() {
  if (!elements.cartItems) return;

  updateCartCount();

  if (!state.cart.length) {
    elements.cartItems.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Your cart is empty. Explore our collections to add products.</p>
      </div>
    `;
    elements.cartSubtotal.textContent = utils.formatCurrency(0);
    return;
  }

  elements.cartItems.innerHTML = state.cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item__info">
        <div>
          <strong>${item.name}</strong>
          <p>${utils.formatCurrency(item.price)}</p>
        </div>
        <div class="cart-item__actions">
          <div class="quantity-controls">
            <button data-cart-action="decrease" data-product-id="${item.id}" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button data-cart-action="increase" data-product-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="icon-button" data-cart-action="remove" data-product-id="${item.id}" aria-label="Remove item">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  const { subtotal } = calculateTotals('razorpay');
  elements.cartSubtotal.textContent = utils.formatCurrency(subtotal);
}

function updateCartCount() {
  const count = state.cart.reduce((acc, item) => acc + item.quantity, 0);
  if (elements.cartCount) {
    elements.cartCount.textContent = count;
  }
}

function toggleCart(open) {
  if (!elements.cartDrawer) return;
  if (open) {
    elements.cartDrawer.classList.add('open');
    elements.cartDrawer.setAttribute('aria-hidden', 'false');
  } else {
    elements.cartDrawer.classList.remove('open');
    elements.cartDrawer.setAttribute('aria-hidden', 'true');
  }
}

function openCheckout() {
  if (!state.cart.length) {
    utils.showToast('Add items to your cart before checking out.', 'error');
    return;
  }
  toggleCart(false);
  utils.openElement(elements.checkoutModal);
}

function closeAllModals() {
  utils.closeElement(elements.checkoutModal);
  utils.closeElement(elements.trackingModal);
}

function calculateTotals(paymentMethod) {
  const subtotal = state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryFee = paymentMethod === 'cod' ? 40 : 0;
  const total = subtotal + deliveryFee;
  return { subtotal, deliveryFee, total };
}

function handleCheckoutSubmit(event) {
  event.preventDefault();
  if (!state.cart.length) {
    utils.showToast('Your cart is empty.', 'error');
    return;
  }

  const formData = new FormData(elements.checkoutForm);
  const customer = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone').trim(),
    address: formData.get('address').trim()
  };
  const paymentMethod = formData.get('payment');

  if (!customer.name || !customer.email || !customer.phone || !customer.address) {
    utils.showToast('Please fill all required fields.', 'error');
    return;
  }

  const totals = calculateTotals(paymentMethod);
  const trackingDetails = generateTrackingDetails();
  const orderPayload = {
    id: utils.randomId('ORD'),
    items: structuredClone(state.cart),
    createdAt: new Date().toISOString(),
    customer,
    totals,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'Pending COD' : 'Pending Payment'
    },
    statusIndex: 0,
    statusUpdates: trackingDetails.statusUpdates,
    tracking: trackingDetails.tracking
  };

  if (paymentMethod === 'razorpay') {
    initiateRazorpay(orderPayload);
  } else {
    finalizeOrder(orderPayload);
    utils.showToast('Order placed with Cash on Delivery.');
    closeAllModals();
  }
}

function initiateRazorpay(orderPayload) {
  if (typeof Razorpay === 'undefined') {
    utils.showToast('Payment gateway is still loading. Please try again in a moment.', 'error');
    return;
  }

  pendingCheckout = orderPayload;

  const fallbackKey = 'rzp_test_1DP5mmOlF5G5ag';
  const configuredKey = (state.settings?.razorpayLiveKey || state.settings?.razorpayTestKey || '').trim();
  const razorpayKey = configuredKey || fallbackKey;

  const options = {
    key: razorpayKey,
    amount: orderPayload.totals.total * 100,
    currency: 'INR',
    name: 'LuxeThreads',
    description: 'Order Payment',
    image: 'https://i.postimg.cc/fTmVyrnR/Black-White-Minimalist-Business-Logo-removebg-preview.png',
    handler: function handler(response) {
      if (!pendingCheckout) return;
      pendingCheckout.payment = {
        method: 'razorpay',
        status: 'Paid',
        transactionId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      };
      pendingCheckout.statusIndex = 1;
      pendingCheckout.statusUpdates = pendingCheckout.statusUpdates || {};
      pendingCheckout.statusUpdates['Processing'] = new Date().toISOString();
      finalizeOrder(pendingCheckout);
      pendingCheckout = null;
      closeAllModals();
      utils.showToast('Payment successful! Your order has been placed.');
    },
    prefill: {
      name: orderPayload.customer.name,
      email: orderPayload.customer.email,
      contact: orderPayload.customer.phone
    },
    notes: {
      shipping_address: orderPayload.customer.address
    },
    theme: {
      color: '#f97316'
    }
  };

  const rzp = new Razorpay(options);
  rzp.on('payment.failed', function onFailure(response) {
    console.error('Payment failed', response);
    utils.showToast('Payment unsuccessful. Please try again.', 'error');
  });
  rzp.open();
}

function finalizeOrder(orderPayload) {
  state.orders.unshift(orderPayload);
  utils.save(STORAGE_KEYS.orders, state.orders);

  state.cart = [];
  persistCart();
  renderCart();
  renderOrders();
  elements.checkoutForm?.reset();
}

function renderOrders() {
  if (!elements.ordersList) return;

  if (!state.orders.length) {
    elements.ordersList.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <p>No orders yet. Start shopping to see your order history here.</p>
      </div>
    `;
    return;
  }

  elements.ordersList.innerHTML = state.orders.map((order) => {
    const { id, items, totals, createdAt, payment, statusIndex } = order;
    const createdDate = new Date(createdAt);
    const orderItemsText = items.map((item) => `${item.quantity} x ${item.name}`).join(' | ');
    const statusLabel = ORDER_STATUSES[statusIndex] ?? ORDER_STATUSES[0];
    const etaText = order.tracking?.estimatedDelivery
      ? `ETA ${new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN', { dateStyle: 'medium' })}`
      : '';

    const timeline = ORDER_STATUSES.map((stage, index) => `
      <span class="timeline-step ${index <= statusIndex ? 'active' : ''}">
        <i class="fa-solid fa-circle"></i>
        ${stage}
      </span>
    `).join('');

    return `
      <article class="order-card">
        <header class="order-card__header">
          <div>
            <h3>Order ${id}</h3>
            <span>Placed on ${createdDate.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            ${etaText ? `<p class="hint">${etaText}</p>` : ''}
          </div>
          <div class="tag"><i class="fa-solid fa-truck-fast"></i> ${statusLabel}</div>
        </header>
        <div class="order-card__items">${orderItemsText}</div>
        <footer class="order-card__footer">
          <div>
            <strong>${utils.formatCurrency(totals.total)}</strong>
            <p class="subtitle">Payment: ${payment.method === 'cod' ? 'Cash on Delivery' : 'Razorpay'} - ${payment.status}</p>
          </div>
          <div class="timeline">${timeline}</div>
          <button class="btn btn--ghost" data-track-order data-order-id="${id}">
            <i class="fa-solid fa-route"></i> Track Package
          </button>
        </footer>
      </article>
    `;
  }).join('');
}

function openTracking(orderId) {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) {
    utils.showToast('Unable to find this order right now.', 'error');
    return;
  }

  const carrierInfo = order.tracking?.carrier || 'To be assigned';
  const trackingId = order.tracking?.id || 'Pending generation';
  const etaDelivery = order.tracking?.estimatedDelivery
    ? new Date(order.tracking.estimatedDelivery).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'TBD';

  const header = `
    <div class="tracking-header">
      <div>
        <strong>${order.id}</strong>
        <p class="subtitle">${order.items.length} item(s) - ${utils.formatCurrency(order.totals.total)}</p>
      </div>
      <div class="tag">${ORDER_STATUSES[order.statusIndex] ?? ORDER_STATUSES[0]}</div>
    </div>
    <div class="tracking-meta">
      <div>
        <span>Carrier</span>
        <strong>${carrierInfo}</strong>
      </div>
      <div>
        <span>Tracking ID</span>
        <strong>${trackingId}</strong>
      </div>
      <div>
        <span>Est. Delivery</span>
        <strong>${etaDelivery}</strong>
      </div>
    </div>
  `;

  const timeline = ORDER_STATUSES.map((stage, index) => {
    const isActive = index <= order.statusIndex;
    const actualDate = index === 0 ? order.createdAt : order.statusUpdates?.[stage];
    const etaDate = order.tracking?.eta?.[stage];
    return `
      <div class="tracking-line">
        <span class="tracking-point ${isActive ? 'active' : ''}">${isActive ? '<i class="fa-solid fa-check"></i>' : ''}</span>
        <div>
          <p class="tracking-status">${stage}</p>
          <p class="tracking-date">${actualDate
      ? new Date(actualDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      : etaDate
        ? `ETA ${new Date(etaDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`
        : 'Pending update'}</p>
        </div>
      </div>
    `;
  }).join('');

  elements.trackingContent.innerHTML = `${header}<div class="tracking-timeline">${timeline}</div>`;
  utils.openElement(elements.trackingModal);
}

function handleOwnerShortcut(event) {
  if (event.repeat) return;
  if (!event.altKey || !event.shiftKey || event.code !== 'KeyL') return;
  const targetTag = event.target?.tagName;
  if (targetTag && ['INPUT', 'TEXTAREA'].includes(targetTag)) return;
  event.preventDefault();
  utils.showToast('Redirecting to owner portal...', 'info');
  setTimeout(() => {
    window.location.href = OWNER_PORTAL_URL;
  }, 300);
}

document.addEventListener('click', (event) => {
  if (event.target.matches('.modal')) {
    closeAllModals();
  }
});

init();
