const STORAGE_KEYS = {
  products: 'luxethreads_products_v1',
  cart: 'luxethreads_cart_v1',
  orders: 'luxethreads_orders_v1',
  users: 'luxethreads_users_v1',
  session: 'luxethreads_session_v1',
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

const DEFAULT_SETTINGS = {
  razorpayTestKey: 'rzp_test_1DP5mmOlF5G5ag',
  razorpayLiveKey: ''
};

const UPI_ID = 'luxethreads@upi';

const state = {
  products: [],
  cart: [],
  orders: [],
  customers: [],
  user: null,
  settings: structuredClone(DEFAULT_SETTINGS),
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
  toast: document.getElementById('toast'),
  accountButton: document.getElementById('accountButton'),
  accountLabel: document.getElementById('accountLabel'),
  accountMenu: document.getElementById('accountMenu'),
  accountGreeting: document.getElementById('accountGreeting'),
  accountEmail: document.getElementById('accountEmail'),
  accountOrders: document.getElementById('accountOrders'),
  accountLogout: document.getElementById('accountLogout'),
  accountModal: document.getElementById('accountModal'),
  authForm: document.getElementById('authForm'),
  authMode: document.getElementById('authMode'),
  authNameField: document.getElementById('authNameField'),
  authTitle: document.getElementById('authTitle'),
  authSubmit: document.getElementById('authSubmit'),
  authSwitch: document.getElementById('authSwitch'),
  authSwitchLabel: document.getElementById('authSwitchLabel'),
  toggleAuthMode: document.getElementById('toggleAuthMode'),
  authError: document.getElementById('authError'),
  ownerPortalLink: document.getElementById('ownerPortalLink'),
  upiQRSection: document.getElementById('upiQRSection'),
  upiReference: document.getElementById('upiReference'),
  upiQRCode: document.getElementById('upiQRCode'),
  upiIdLabel: document.getElementById('upiId')
};

let pendingCheckout = null;
let accountMenuOpen = false;

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

const auth = {
  normaliseEmail(value) {
    return value.trim().toLowerCase();
  },
  hash(password) {
    try {
      const encoder = new TextEncoder();
      const bytes = encoder.encode(password);
      let binary = '';
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      return btoa(binary);
    } catch (error) {
      console.error('Failed to hash password', error);
      return btoa(password);
    }
  },
  compare(rawPassword, hashedPassword) {
    return auth.hash(rawPassword) === hashedPassword;
  }
};

function init() {
  hydrateState();
  bindEvents();
  renderAll();
}

function hydrateState() {
  const storedProducts = utils.load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  const storedCart = utils.load(STORAGE_KEYS.cart, []);
  const storedOrders = utils.load(STORAGE_KEYS.orders, []);
  const storedCustomers = utils.load(STORAGE_KEYS.users, []);
  const storedSettings = utils.load(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const storedSession = utils.load(STORAGE_KEYS.session, null);

  if (!storedProducts.length) {
    utils.save(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    state.products = structuredClone(DEFAULT_PRODUCTS);
  } else {
    state.products = storedProducts;
  }

  state.cart = Array.isArray(storedCart) ? storedCart : [];
  state.orders = sanitizeOrders(storedOrders);
  state.customers = Array.isArray(storedCustomers) ? storedCustomers : [];
  state.settings = { ...DEFAULT_SETTINGS, ...(storedSettings || {}) };

  const validSession = validateSession(storedSession);
  state.user = validSession;

  if (!validSession) {
    persistSession(null);
  }

  if (elements.year) {
    elements.year.textContent = new Date().getFullYear();
  }

  if (elements.upiIdLabel) {
    elements.upiIdLabel.textContent = UPI_ID;
  }
  if (elements.upiQRCode) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`upi://pay?pa=${UPI_ID}&pn=LuxeThreads&cu=INR`)}`;
    elements.upiQRCode.src = qrUrl;
  }
}

function sanitizeOrders(orders) {
  if (!Array.isArray(orders)) return [];
  return orders.map((order) => {
    const createdAt = order?.createdAt ?? new Date().toISOString();
    const statusIndex = Number.isFinite(order?.statusIndex) ? order.statusIndex : 0;
    const statusUpdates = { ...(order?.statusUpdates || {}) };
    if (!statusUpdates[ORDER_STATUSES[0]]) {
      statusUpdates[ORDER_STATUSES[0]] = createdAt;
    }
    return {
      ...order,
      createdAt,
      statusIndex,
      statusUpdates,
      customer: order?.customer || {},
      payment: order?.payment || { method: 'razorpay', status: 'Pending Payment' }
    };
  });
}

function validateSession(session) {
  if (!session?.email) return null;
  const email = auth.normaliseEmail(session.email);
  const user = state.customers.find((customer) => auth.normaliseEmail(customer.email) === email || customer.id === session.id);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}

function persistSession(user) {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.session);
    return;
  }
  utils.save(STORAGE_KEYS.session, {
    id: user.id,
    name: user.name,
    email: user.email
  });
}

function persistCustomers() {
  utils.save(STORAGE_KEYS.users, state.customers);
}

function bindEvents() {
  elements.navToggle?.addEventListener('click', () => {
    elements.navMenu?.classList.toggle('open');
  });

  elements.navMenu?.addEventListener('click', (event) => {
    if (event.target.tagName === 'A') {
      elements.navMenu.classList.remove('open');
      closeAccountMenu();
    }
  });

  elements.accountButton?.addEventListener('click', handleAccountButtonClick);
  elements.accountOrders?.addEventListener('click', handleAccountOrdersClick);
  elements.accountLogout?.addEventListener('click', () => {
    signOut();
  });

  elements.openCart?.addEventListener('click', () => toggleCart(true));
  elements.closeCart?.addEventListener('click', () => toggleCart(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleCart(false);
      closeAllModals();
      closeAccountMenu();
    }
    if (event.altKey && event.shiftKey && event.code === 'KeyA') {
      event.preventDefault();
      elements.ownerPortalLink?.click();
    }
  });

  document.addEventListener('click', handleDocumentClick);

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
  elements.checkoutForm?.addEventListener('change', handlePaymentOptionChange);
  const initialPayment = elements.checkoutForm?.querySelector('input[name="payment"]:checked');
  if (initialPayment) {
    handlePaymentOptionChange({ target: initialPayment });
  }

  elements.ordersList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-track-order]');
    if (!button) return;
    const { orderId } = button.dataset;
    openTracking(orderId);
  });

  elements.refreshOrders?.addEventListener('click', () => {
    state.orders = sanitizeOrders(utils.load(STORAGE_KEYS.orders, []));
    renderOrders();
    utils.showToast('Orders refreshed.');
  });

  elements.toggleAuthMode?.addEventListener('click', toggleAuthModeHandler);
  elements.authForm?.addEventListener('submit', handleAuthSubmit);

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
      state.orders = sanitizeOrders(utils.load(STORAGE_KEYS.orders, []));
      renderOrders();
    }
    if (event.key === STORAGE_KEYS.users) {
      state.customers = utils.load(STORAGE_KEYS.users, []);
      const current = validateSession(utils.load(STORAGE_KEYS.session, null));
      state.user = current;
      renderAccountUI();
      renderOrders();
    }
    if (event.key === STORAGE_KEYS.session) {
      const current = validateSession(utils.load(STORAGE_KEYS.session, null));
      state.user = current;
      renderAccountUI();
      renderOrders();
    }
    if (event.key === STORAGE_KEYS.settings) {
      state.settings = { ...DEFAULT_SETTINGS, ...utils.load(STORAGE_KEYS.settings, DEFAULT_SETTINGS) };
    }
  });
}

function renderAll() {
  renderProducts();
  renderCart();
  renderOrders();
  renderAccountUI();
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

function handleAccountButtonClick(event) {
  event?.preventDefault?.();
  if (state.user) {
    toggleAccountMenu();
  } else {
    openAccountModal('signin');
  }
}

function handleAccountOrdersClick(event) {
  event?.preventDefault?.();
  closeAccountMenu();
  document.getElementById('my-orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleDocumentClick(event) {
  if (!accountMenuOpen) return;
  if (elements.accountMenu?.contains(event.target) || elements.accountButton?.contains(event.target)) {
    return;
  }
  closeAccountMenu();
}

function toggleAccountMenu() {
  if (!state.user) return;
  if (accountMenuOpen) {
    closeAccountMenu();
  } else {
    openAccountMenu();
  }
}

function openAccountMenu() {
  if (!state.user || !elements.accountMenu) return;
  accountMenuOpen = true;
  elements.accountMenu.classList.add('open');
  elements.accountMenu.setAttribute('aria-hidden', 'false');
  elements.accountButton?.setAttribute('aria-expanded', 'true');
}

function closeAccountMenu() {
  accountMenuOpen = false;
  elements.accountMenu?.classList.remove('open');
  elements.accountMenu?.setAttribute('aria-hidden', 'true');
  elements.accountButton?.setAttribute('aria-expanded', 'false');
}

function openAccountModal(mode = 'signin') {
  setAuthMode(mode);
  elements.authForm?.reset();
  elements.authError.textContent = '';
  utils.openElement(elements.accountModal);
  const focusTarget = mode === 'signup'
    ? elements.authNameField?.querySelector('input')
    : document.getElementById('authEmail');
  focusTarget?.focus({ preventScroll: true });
}

function setAuthMode(mode) {
  const normalised = mode === 'signup' ? 'signup' : 'signin';
  if (elements.authMode) {
    elements.authMode.value = normalised;
  }
  if (elements.authTitle) {
    elements.authTitle.textContent = normalised === 'signup' ? 'Create account' : 'Sign in';
  }
  if (elements.authSubmit) {
    elements.authSubmit.textContent = normalised === 'signup' ? 'Create account' : 'Sign in';
  }
  if (elements.authNameField) {
    elements.authNameField.hidden = normalised !== 'signup';
    const nameInput = elements.authNameField.querySelector('input');
    if (nameInput) {
      nameInput.required = normalised === 'signup';
    }
  }
  if (elements.authSwitchLabel) {
    elements.authSwitchLabel.textContent = normalised === 'signup'
      ? 'Already part of LuxeThreads?'
      : 'New to LuxeThreads?';
  }
  if (elements.toggleAuthMode) {
    elements.toggleAuthMode.textContent = normalised === 'signup' ? 'Sign in' : 'Create an account';
  }
}

function toggleAuthModeHandler(event) {
  event?.preventDefault?.();
  const currentMode = elements.authMode?.value === 'signup' ? 'signup' : 'signin';
  setAuthMode(currentMode === 'signup' ? 'signin' : 'signup');
  elements.authError.textContent = '';
  if (elements.authMode?.value === 'signup') {
    elements.authNameField?.querySelector('input')?.focus({ preventScroll: true });
  } else {
    document.getElementById('authEmail')?.focus({ preventScroll: true });
  }
}

function handleAuthSubmit(event) {
  event.preventDefault();
  if (!elements.authForm) return;

  const formData = new FormData(elements.authForm);
  const mode = formData.get('mode') === 'signup' ? 'signup' : 'signin';
  const emailRaw = (formData.get('email') || '').toString();
  const passwordRaw = (formData.get('password') || '').toString();
  const nameRaw = (formData.get('fullName') || '').toString();

  const email = auth.normaliseEmail(emailRaw);
  const password = passwordRaw.trim();
  const name = nameRaw.trim();

  if (!email || !password) {
    elements.authError.textContent = 'Email and password are required.';
    return;
  }

  if (mode === 'signup') {
    if (!name) {
      elements.authError.textContent = 'Please share your full name to personalise your experience.';
      return;
    }
    if (state.customers.some((customer) => auth.normaliseEmail(customer.email) === email)) {
      elements.authError.textContent = 'This email is already registered. Try signing in instead.';
      return;
    }
    const customer = {
      id: utils.randomId('CUS'),
      name,
      email,
      password: auth.hash(password),
      createdAt: new Date().toISOString()
    };
    state.customers.push(customer);
    persistCustomers();
    completeSignIn(customer, true);
    utils.showToast('Account created successfully. Welcome aboard!');
  } else {
    const customer = state.customers.find((entry) => auth.normaliseEmail(entry.email) === email);
    if (!customer || !auth.compare(password, customer.password)) {
      elements.authError.textContent = 'Incorrect email or password. Please try again.';
      return;
    }
    completeSignIn(customer, false);
    utils.showToast(`Welcome back, ${customer.name.split(' ')[0] || customer.name}.`);
  }

  elements.authForm.reset();
  elements.authError.textContent = '';
  closeAllModals();
}

function completeSignIn(customer, createdNow) {
  state.user = {
    id: customer.id,
    name: customer.name,
    email: customer.email
  };
  persistSession(state.user);
  renderAccountUI();
  renderOrders();
  if (createdNow) {
    document.getElementById('my-orders')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function signOut() {
  if (!state.user) return;
  persistSession(null);
  state.user = null;
  closeAccountMenu();
  renderAccountUI();
  renderOrders();
  utils.showToast('Signed out successfully. See you soon!');
}

function renderAccountUI() {
  const isLoggedIn = Boolean(state.user);
  if (elements.accountLabel) {
    const fallbackLabel = isLoggedIn ? (state.user.name.split(' ')[0] || 'Account') : 'Sign In';
    elements.accountLabel.textContent = fallbackLabel;
  }
  if (!isLoggedIn) {
    closeAccountMenu();
  } else if (accountMenuOpen) {
    openAccountMenu();
  }
  if (elements.accountGreeting) {
    elements.accountGreeting.textContent = isLoggedIn
      ? `Hello, ${state.user.name.split(' ')[0] || state.user.name}`
      : 'Welcome guest';
  }
  if (elements.accountEmail) {
    elements.accountEmail.textContent = isLoggedIn ? state.user.email : '';
  }
  if (elements.accountLogout) {
    elements.accountLogout.toggleAttribute('disabled', !isLoggedIn);
  }
  if (elements.accountOrders) {
    elements.accountOrders.toggleAttribute('disabled', !isLoggedIn);
  }
  if (elements.accountButton) {
    elements.accountButton.setAttribute('aria-haspopup', isLoggedIn ? 'true' : 'false');
    elements.accountButton.setAttribute('aria-expanded', isLoggedIn && accountMenuOpen ? 'true' : 'false');
  }
}

function ensureAuthenticated() {
  if (state.user) return true;
  utils.showToast('Please sign in to continue.', 'error');
  openAccountModal('signin');
  return false;
}

function handlePaymentOptionChange(event) {
  if (event.target.name !== 'payment') return;
  const selected = event.target.value;
  const isUPI = selected === 'upi-qr';
  if (elements.upiQRSection) {
    if (isUPI) {
      elements.upiQRSection.hidden = false;
    } else {
      elements.upiQRSection.hidden = true;
    }
  }
  if (elements.upiReference) {
    if (isUPI) {
      elements.upiReference.setAttribute('required', 'required');
    } else {
      elements.upiReference.removeAttribute('required');
      elements.upiReference.value = '';
    }
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
  if (!ensureAuthenticated()) {
    return;
  }
  toggleCart(false);
  utils.openElement(elements.checkoutModal);
}

function closeAllModals() {
  utils.closeElement(elements.checkoutModal);
  utils.closeElement(elements.trackingModal);
  utils.closeElement(elements.accountModal);
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
  if (!ensureAuthenticated()) {
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
  const upiReference = (formData.get('upiReference') || '').toString().trim();

  if (!customer.name || !customer.email || !customer.phone || !customer.address) {
    utils.showToast('Please fill all required fields.', 'error');
    return;
  }

  if (paymentMethod === 'upi-qr' && !upiReference) {
    utils.showToast('Enter the UPI transaction reference to continue.', 'error');
    elements.upiReference?.focus({ preventScroll: true });
    return;
  }

  const totals = calculateTotals(paymentMethod);
  const now = new Date().toISOString();
  const orderPayload = {
    id: utils.randomId('ORD'),
    items: structuredClone(state.cart),
    createdAt: now,
    customer,
    customerId: state.user?.id || null,
    totals,
    payment: {
      method: paymentMethod,
      status: paymentMethod === 'cod'
        ? 'Pending COD'
        : paymentMethod === 'upi-qr'
          ? 'Awaiting Confirmation'
          : 'Pending Payment',
      reference: paymentMethod === 'upi-qr' ? upiReference : undefined
    },
    statusIndex: 0,
    statusUpdates: {
      [ORDER_STATUSES[0]]: now
    }
  };

  if (paymentMethod === 'razorpay') {
    initiateRazorpay(orderPayload);
  } else {
    finalizeOrder(orderPayload);
    const message = paymentMethod === 'upi-qr'
      ? 'Thank you! We will verify your UPI payment and share updates shortly.'
      : 'Order placed with Cash on Delivery.';
    utils.showToast(message);
    closeAllModals();
  }
}

function initiateRazorpay(orderPayload) {
  if (typeof Razorpay === 'undefined') {
    utils.showToast('Payment gateway is still loading. Please try again in a moment.', 'error');
    return;
  }

  pendingCheckout = orderPayload;
  const razorpayKey = state.settings.razorpayLiveKey || state.settings.razorpayTestKey || DEFAULT_SETTINGS.razorpayTestKey;

  const options = {
    key: razorpayKey,
    amount: orderPayload.totals.total * 100,
    currency: 'INR',
    name: 'LuxeThreads',
    description: 'Order Payment',
    image: 'https://i.postimg.cc/fTmVyrnR/Black-White-Minimalist-Business-Logo-removebg-preview.png',
    handler: function handler(response) {
      if (!pendingCheckout) return;
      const timestamp = new Date().toISOString();
      pendingCheckout.payment = {
        method: 'razorpay',
        status: 'Paid',
        transactionId: response.razorpay_payment_id,
        signature: response.razorpay_signature
      };
      pendingCheckout.statusIndex = 1;
      pendingCheckout.statusUpdates[ORDER_STATUSES[1]] = timestamp;
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
  const normalized = {
    ...orderPayload,
    statusUpdates: {
      ...orderPayload.statusUpdates,
      [ORDER_STATUSES[orderPayload.statusIndex] ?? ORDER_STATUSES[0]]:
        orderPayload.statusUpdates?.[ORDER_STATUSES[orderPayload.statusIndex]] || new Date().toISOString()
    }
  };

  state.orders.unshift(normalized);
  utils.save(STORAGE_KEYS.orders, state.orders);

  state.cart = [];
  persistCart();
  renderCart();
  renderOrders();
  elements.checkoutForm?.reset();
  if (elements.upiQRSection) {
    elements.upiQRSection.hidden = true;
  }
  if (elements.upiReference) {
    elements.upiReference.removeAttribute('required');
    elements.upiReference.value = '';
  }
}

function renderOrders() {
  if (!elements.ordersList) return;

  if (!state.user) {
    elements.ordersList.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-user-lock"></i>
        <p>Sign in to view and track your LuxeThreads orders.</p>
        <button class="btn btn--primary" id="ordersLoginTrigger" type="button"><i class="fa-solid fa-right-to-bracket"></i> Sign in</button>
      </div>
    `;
    document.getElementById('ordersLoginTrigger')?.addEventListener('click', () => openAccountModal('signin'));
    return;
  }

  const userOrders = state.orders.filter((order) => {
    const emailMatch = auth.normaliseEmail(order.customer?.email || '') === auth.normaliseEmail(state.user.email);
    return order.customerId === state.user.id || emailMatch;
  });

  if (!userOrders.length) {
    elements.ordersList.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-box-open"></i>
        <p>Your future favourites will appear here after checkout.</p>
      </div>
    `;
    return;
  }

  elements.ordersList.innerHTML = userOrders.map((order) => {
    const { id, items, totals, createdAt, payment, statusIndex } = order;
    const createdDate = new Date(createdAt);
    const orderItemsText = items.map((item) => `${item.quantity} x ${item.name}`).join(' | ');
    const statusLabel = ORDER_STATUSES[statusIndex] ?? ORDER_STATUSES[0];
    const paymentMethodLabel = payment.method === 'cod'
      ? 'Cash on Delivery'
      : payment.method === 'upi-qr'
        ? 'UPI QR'
        : 'Razorpay';

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
          </div>
          <div class="tag"><i class="fa-solid fa-truck-fast"></i> ${statusLabel}</div>
        </header>
        <div class="order-card__items">${orderItemsText}</div>
        <footer class="order-card__footer">
          <div>
            <strong>${utils.formatCurrency(totals.total)}</strong>
            <p class="subtitle">Payment: ${paymentMethodLabel} - ${payment.status}</p>
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

  const header = `
    <div class="tracking-header">
      <div>
        <strong>${order.id}</strong>
        <p class="subtitle">${order.items.length} item(s) - ${utils.formatCurrency(order.totals.total)}</p>
        <p class="subtitle">Payment: ${order.payment.method === 'cod' ? 'Cash on Delivery' : order.payment.method === 'upi-qr' ? 'UPI QR' : 'Razorpay'} ? ${order.payment.status}${order.payment.reference ? ` ? Ref: ${order.payment.reference}` : ''}</p>
      </div>
      <div class="tag">${ORDER_STATUSES[order.statusIndex] ?? ORDER_STATUSES[0]}</div>
    </div>
  `;

  const timeline = ORDER_STATUSES.map((stage, index) => {
    const isActive = index <= order.statusIndex;
    const date = index === 0 ? order.createdAt : order.statusUpdates?.[stage];
    return `
      <div class="tracking-line">
        <span class="tracking-point ${isActive ? 'active' : ''}">${isActive ? '<i class="fa-solid fa-check"></i>' : ''}</span>
        <div>
          <p class="tracking-status">${stage}</p>
          <p class="tracking-date">${date ? new Date(date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Pending update'}</p>
        </div>
      </div>
    `;
  }).join('');

  elements.trackingContent.innerHTML = `${header}<div class="tracking-timeline">${timeline}</div>`;
  utils.openElement(elements.trackingModal);
}

document.addEventListener('click', (event) => {
  if (event.target.matches('.modal')) {
    closeAllModals();
  }
});

init();
