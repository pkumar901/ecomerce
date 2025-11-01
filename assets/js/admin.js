const STORAGE_KEYS = {
  products: 'luxethreads_products_v1',
  orders: 'luxethreads_orders_v1',
  settings: 'luxethreads_settings_v1'
};

const ADMIN_SESSION_KEY = 'luxethreads_admin_session';

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
  }
];

const ORDER_STATUSES = [
  'Order Placed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

const ADMIN_CREDENTIALS = {
  email: 'owner@luxethreads.in',
  password: 'Luxe@2025'
};

const state = {
  products: [],
  orders: [],
  settings: {
    razorpayTestKey: 'rzp_test_1DP5mmOlF5G5ag',
    razorpayLiveKey: 'rzp_live_RaPJt9LKscSrRl',
    razorpayLiveSecret: 'EfR1XM8Ost0wdiU2rq5ScLSR'
  }
};

const els = {
  app: document.querySelector('.admin-app'),
  loginOverlay: document.getElementById('loginOverlay'),
  loginForm: document.getElementById('adminLoginForm'),
  logoutBtn: document.getElementById('logoutBtn'),
  navLinks: document.querySelectorAll('.sidebar__link'),
  panels: document.querySelectorAll('.panel'),
  toast: document.getElementById('adminToast'),
  productForm: document.getElementById('productForm'),
  productTable: document.getElementById('productTable'),
  productEmpty: document.getElementById('productEmpty'),
  orderTable: document.getElementById('orderTable'),
  orderEmpty: document.getElementById('orderEmpty'),
  statOrders: document.getElementById('statOrders'),
  statRevenue: document.getElementById('statRevenue'),
  statCOD: document.getElementById('statCOD'),
  statProducts: document.getElementById('statProducts'),
  recentOrders: document.getElementById('recentOrders'),
  paymentChart: document.getElementById('paymentChart'),
  exportProducts: document.getElementById('exportProducts'),
  syncData: document.getElementById('syncData'),
  markAllDelivered: document.getElementById('markAllDelivered'),
  settingsForm: document.getElementById('settingsForm')
};

const utils = {
  load(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return structuredClone(fallback);
      return JSON.parse(raw);
    } catch (error) {
      console.error(`Failed to parse ${key}`, error);
      return structuredClone(fallback);
    }
  },
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to persist ${key}`, error);
    }
  },
  formatCurrency(value) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);
  },
  showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add('show');
    setTimeout(() => els.toast.classList.remove('show'), 2600);
  },
  randomId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-3)}`;
  }
};

function init() {
  hydrateState();
  bindEvents();
  guardAccess();
  window.addEventListener('storage', handleExternalUpdates);
}

function hydrateState() {
  state.products = utils.load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  state.orders = utils.load(STORAGE_KEYS.orders, []);
  state.settings = utils.load(STORAGE_KEYS.settings, state.settings);

  if (!state.products.length) {
    state.products = structuredClone(DEFAULT_PRODUCTS);
    utils.save(STORAGE_KEYS.products, state.products);
  }

  if (els.settingsForm) {
    els.settingsForm.razorpayTestKey.value = state.settings.razorpayTestKey || '';
    els.settingsForm.razorpayLiveKey.value = state.settings.razorpayLiveKey || '';
    if (els.settingsForm.razorpayLiveSecret) {
      els.settingsForm.razorpayLiveSecret.value = state.settings.razorpayLiveSecret || '';
    }
  }
}

function bindEvents() {
  els.loginForm?.addEventListener('submit', handleLogin);
  els.logoutBtn?.addEventListener('click', handleLogout);
  els.productForm?.addEventListener('submit', handleProductSubmit);
  els.productTable?.addEventListener('click', handleProductTableClick);
  els.orderTable?.addEventListener('change', handleOrderStatusChange);
  els.orderTable?.addEventListener('click', handleOrderTableClick);
  els.exportProducts?.addEventListener('click', exportProducts);
  els.syncData?.addEventListener('click', syncData);
  els.markAllDelivered?.addEventListener('click', markOrdersDelivered);
  els.settingsForm?.addEventListener('submit', handleSettingsSave);

  els.navLinks?.forEach((link) => {
    link.addEventListener('click', () => {
      activateSection(link.dataset.section);
    });
  });
}

function guardAccess() {
  const isAuthed = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (isAuthed === 'true') {
    unlockPortal();
  } else {
    lockPortal();
  }
}

function unlockPortal() {
  if (els.loginOverlay) {
    els.loginOverlay.setAttribute('aria-hidden', 'true');
  }
  if (els.app) {
    els.app.setAttribute('aria-hidden', 'false');
  }
  renderAll();
}

function lockPortal() {
  if (els.loginOverlay) {
    els.loginOverlay.setAttribute('aria-hidden', 'false');
  }
  if (els.app) {
    els.app.setAttribute('aria-hidden', 'true');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(els.loginForm);
  const email = formData.get('email').trim();
  const password = formData.get('password').trim();

  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
    utils.showToast('Welcome back, LuxeThreads owner.');
    unlockPortal();
    els.loginForm.reset();
  } else {
    utils.showToast('Invalid credentials. Access denied.');
  }
}

function handleLogout() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  utils.showToast('Session closed.');
  lockPortal();
}

function activateSection(sectionId) {
  els.navLinks.forEach((link) => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
  els.panels.forEach((panel) => {
    panel.classList.toggle('active', panel.id === sectionId);
  });
}

function handleProductSubmit(event) {
  event.preventDefault();
  const formData = new FormData(els.productForm);
  const product = {
    id: generateProductId(formData.get('name')),
    name: formData.get('name').trim(),
    category: formData.get('category'),
    price: Number(formData.get('price')),
    originalPrice: Number(formData.get('originalPrice')),
    image: formData.get('image').trim(),
    badge: formData.get('badge').trim() || 'Featured',
    createdAt: Date.now()
  };

  if (!product.name || !product.image || !product.price || !product.originalPrice) {
    utils.showToast('Please fill all product fields.');
    return;
  }

  state.products.unshift(product);
  utils.save(STORAGE_KEYS.products, state.products);
  els.productForm.reset();
  renderProducts();
  utils.showToast('Product published to storefront.');
}

function handleProductTableClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, productId } = button.dataset;

  if (action === 'remove') {
    state.products = state.products.filter((product) => product.id !== productId);
    utils.save(STORAGE_KEYS.products, state.products);
    renderProducts();
    utils.showToast('Product removed from storefront.');
  }
}

function handleOrderStatusChange(event) {
  const select = event.target.closest('[data-order-status]');
  if (!select) return;
  const orderId = select.dataset.orderId;
  const newIndex = Number(select.value);
  updateOrderStatus(orderId, newIndex);
}

function handleOrderTableClick(event) {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const { action, orderId } = button.dataset;

  if (action === 'delete') {
    state.orders = state.orders.filter((order) => order.id !== orderId);
    utils.save(STORAGE_KEYS.orders, state.orders);
    renderOrders();
    utils.showToast('Order archived.');
  }

  if (action === 'advance') {
    const order = state.orders.find((entry) => entry.id === orderId);
    if (!order) return;
    const nextStatus = Math.min(order.statusIndex + 1, ORDER_STATUSES.length - 1);
    updateOrderStatus(orderId, nextStatus);
  }
}

function exportProducts() {
  const blob = new Blob([JSON.stringify(state.products, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'luxethreads-products.json';
  link.click();
  URL.revokeObjectURL(url);
  utils.showToast('Product catalog exported.');
}

function syncData() {
  state.products = utils.load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
  state.orders = utils.load(STORAGE_KEYS.orders, []);
  renderAll();
  utils.showToast('Synced with latest storefront data.');
}

function markOrdersDelivered() {
  if (!state.orders.length) {
    utils.showToast('No orders to update.');
    return;
  }
  state.orders = state.orders.map((order) => ({
    ...order,
    statusIndex: ORDER_STATUSES.length - 1,
    statusUpdates: {
      ...(order.statusUpdates || {}),
      Delivered: new Date().toISOString()
    },
    payment: order.payment.method === 'cod'
      ? { ...order.payment, status: 'Collected' }
      : order.payment
  }));
  utils.save(STORAGE_KEYS.orders, state.orders);
  renderOrders();
  utils.showToast('All orders marked as delivered.');
}

function handleSettingsSave(event) {
  event.preventDefault();
  const formData = new FormData(els.settingsForm);
  state.settings = {
    razorpayTestKey: formData.get('razorpayTestKey').trim(),
    razorpayLiveKey: formData.get('razorpayLiveKey').trim(),
    razorpayLiveSecret: formData.get('razorpayLiveSecret').trim()
  };
  utils.save(STORAGE_KEYS.settings, state.settings);
  utils.showToast('Settings saved locally.');
}

function updateOrderStatus(orderId, statusIndex) {
  const order = state.orders.find((entry) => entry.id === orderId);
  if (!order) return;

  order.statusIndex = statusIndex;
  order.statusUpdates = order.statusUpdates || {};
  const statusLabel = ORDER_STATUSES[statusIndex];
  order.statusUpdates[statusLabel] = new Date().toISOString();

  if (statusLabel === 'Delivered' && order.payment.method === 'cod') {
    order.payment.status = 'Collected';
  }

  utils.save(STORAGE_KEYS.orders, state.orders);
  renderOrders();
  utils.showToast(`Order ${orderId} is now "${statusLabel}".`);
}

function renderAll() {
  renderProducts();
  renderOrders();
  updateStats();
}

function renderProducts() {
  if (!els.productTable) return;

  if (!state.products.length) {
    els.productTable.innerHTML = '';
    els.productEmpty?.removeAttribute('hidden');
    return;
  }
  els.productEmpty?.setAttribute('hidden', '');

  els.productTable.innerHTML = state.products.map((product) => {
    const createdDate = new Date(product.createdAt).toLocaleDateString('en-IN', {
      dateStyle: 'medium'
    });
    return `
      <tr>
        <td>
          <div class="table-actions">
            <img src="${product.image}" alt="${product.name}" style="width:40px;height:40px;border-radius:12px;object-fit:cover;">
            <div>
              <strong>${product.name}</strong>
              <p class="hint">${product.badge}</p>
            </div>
          </div>
        </td>
        <td>${titleCase(product.category)}</td>
        <td>${utils.formatCurrency(product.price)}</td>
        <td>${createdDate}</td>
        <td>
          <button class="action-icon" data-action="remove" data-product-id="${product.id}" aria-label="Remove product">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOrders() {
  if (!els.orderTable) return;

  if (!state.orders.length) {
    els.orderTable.innerHTML = '';
    els.orderEmpty?.removeAttribute('hidden');
    renderRecentOrders();
    renderPaymentSplit();
    return;
  }
  els.orderEmpty?.setAttribute('hidden', '');

  els.orderTable.innerHTML = state.orders.map((order) => {
    const createdAt = new Date(order.createdAt).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
    const statusOptions = ORDER_STATUSES.map((status, index) => `
      <option value="${index}" ${index === order.statusIndex ? 'selected' : ''}>${status}</option>
    `).join('');

    const paymentPill = order.payment.method === 'cod'
      ? `<span class="pill">COD - ${order.payment.status}</span>`
      : `<span class="pill success">Razorpay - ${order.payment.status}</span>`;

    return `
      <tr>
        <td><strong>${order.id}</strong></td>
        <td>${createdAt}</td>
        <td>
          <div>${order.customer.name}</div>
          <p class="hint">${order.customer.phone}</p>
        </td>
        <td>${utils.formatCurrency(order.totals.total)}</td>
        <td>
          <select class="status-select" data-order-status data-order-id="${order.id}">
            ${statusOptions}
          </select>
        </td>
        <td>${paymentPill}</td>
        <td class="table-actions">
          <button class="action-icon" data-action="advance" data-order-id="${order.id}" title="Next stage">
            <i class="fa-solid fa-forward-step"></i>
          </button>
          <button class="action-icon" data-action="delete" data-order-id="${order.id}" title="Archive order">
            <i class="fa-solid fa-box-archive"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  renderRecentOrders();
  renderPaymentSplit();
}

function renderRecentOrders() {
  if (!els.recentOrders) return;
  const recent = state.orders.slice(0, 5);
  if (!recent.length) {
    els.recentOrders.innerHTML = '<li>No orders yet.</li>';
    return;
  }

  els.recentOrders.innerHTML = recent.map((order) => {
    const status = ORDER_STATUSES[order.statusIndex] ?? ORDER_STATUSES[0];
    return `
      <li>
        <span>${order.id}</span>
        <span class="hint">${status}</span>
      </li>
    `;
  }).join('');
}

function renderPaymentSplit() {
  if (!els.paymentChart) return;
  const total = state.orders.length;
  if (!total) {
    els.paymentChart.innerHTML = '<div class="empty-state">No data yet</div>';
    return;
  }

  const razorpayCount = state.orders.filter((order) => order.payment.method === 'razorpay').length;
  const codCount = total - razorpayCount;
  const razorpayPercent = Math.round((razorpayCount / total) * 100);
  const codPercent = 100 - razorpayPercent;

  els.paymentChart.innerHTML = `
    <div class="hint">Razorpay ${razorpayPercent}% - COD ${codPercent}%</div>
    <div style="display:flex; gap:0.5rem; width:100%; height:10px; border-radius:999px; overflow:hidden; margin-top:0.8rem;">
      <span style="flex:${razorpayCount}; background: rgba(249,115,22,0.7);"></span>
      <span style="flex:${codCount}; background: rgba(52,211,153,0.4);"></span>
    </div>
  `;
}

function updateStats() {
  const totalOrders = state.orders.length;
  const revenue = state.orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0);
  const pendingCOD = state.orders
    .filter((order) => order.payment.method === 'cod' && order.payment.status !== 'Collected')
    .reduce((sum, order) => sum + (order.totals?.total || 0), 0);
  const activeProducts = state.products.length;

  if (els.statOrders) els.statOrders.textContent = totalOrders;
  if (els.statRevenue) els.statRevenue.textContent = utils.formatCurrency(revenue);
  if (els.statCOD) els.statCOD.textContent = utils.formatCurrency(pendingCOD);
  if (els.statProducts) els.statProducts.textContent = activeProducts;
}

function generateProductId(name) {
  const base = name.split(' ').map((word) => word[0]?.toUpperCase() || '').join('').slice(0, 3) || 'LX';
  return utils.randomId(base);
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function handleExternalUpdates(event) {
  if (event.key === STORAGE_KEYS.products) {
    state.products = utils.load(STORAGE_KEYS.products, DEFAULT_PRODUCTS);
    renderProducts();
    updateStats();
  }
  if (event.key === STORAGE_KEYS.orders) {
    state.orders = utils.load(STORAGE_KEYS.orders, []);
    renderOrders();
    updateStats();
  }
}

init();
