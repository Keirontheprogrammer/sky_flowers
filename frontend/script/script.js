
const API = 'http://localhost:5000/api';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

document.getElementById("theme-toggle").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
});


document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});

// Update cart badge
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart
function addToCart(flower) {
  const existing = cart.find(item => item.flower_id === flower.flower_id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...flower, qty: 1 });
  }
  updateCartCount();
  alert(`${flower.name} added to cart!`);
}

// Load flowers on shop page
async function loadFlowers() {
  try {
    const res = await fetch(`${API}/flowers`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const flowers = await res.json();

    const grid = document.getElementById('flowers-grid');
    if (!grid) return;

    if (flowers.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:#999;">
        <h3>No flowers yet. <a href="admin.html" style="color:#d63384;">Add some in Admin Panel</a></h3>
      </div>`;
      return;
    }

    grid.innerHTML = flowers.map(f => {
      const safeData = JSON.stringify(f).replace(/"/g, '&quot;');
      const firstImg = f.images?.[0] || 'https://via.placeholder.com/400x400/f8bbd0/d63384?text=No+Image';

      return `
        <div class="flower-card" onclick="location.href='product.html?id=${f.flower_id}'">
          <img src="${firstImg}" alt="${f.name}" loading="lazy"
               onerror="this.src='https://via.placeholder.com/400x400/f8bbd0/d63384?text=No+Image'">
          <div class="flower-info">
            <h3>${f.name}</h3>
            <p>${f.colors}</p>
            <div class="price">MKW ${parseFloat(f.price).toLocaleString()}</div>
            <button class="btn" onclick="event.stopPropagation(); addToCart(${safeData})">
              Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    console.error("Failed to load flowers:", err);
    document.getElementById('flowers-grid').innerHTML = 
      `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:red;">
        <h3>Can't load flowers</h3>
        <p>Make sure <code>node server.js</code> is running</p>
      </div>`;
  }
}

// Load single product page
async function loadProduct() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return;

  try {
    const res = await fetch(`${API}/flowers/${id}`);
    if (!res.ok) throw new Error("Flower not found");
    const flower = await res.json();

    document.getElementById('product-title').textContent = flower.name;
    document.getElementById('product-price').textContent = `MKW ${parseFloat(flower.price).toLocaleString()}`;
    document.getElementById('product-colors').textContent = flower.colors;

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = (flower.images || []).map(src => 
      `<img src="${src}" onclick="this.requestFullscreen()" style="cursor:zoom-in;">`
    ).join('') || '<p>No images available</p>';

    document.getElementById('add-btn').onclick = () => addToCart(flower);

  } catch (err) {
    document.querySelector('.container').innerHTML = `<h3 style="color:red;text-align:center;">Flower not found</h3>`;
  }
}

// Load cart page
function loadCart() {
  const itemsDiv = document.getElementById('cart-items');
  const totalEl = document.getElementById('total');

  if (cart.length === 0) {
    itemsDiv.innerHTML = '<p style="text-align:center;padding:3rem;color:#999;">Your cart is empty</p>';
    if (totalEl) totalEl.textContent = '0';
    return;
  }

  itemsDiv.innerHTML = cart.map((item, i) => {
    const img = item.images?.[0] || 'https://via.placeholder.com/80';
    return `
      <div style="display:flex;gap:1rem;align-items:center;margin:1rem 0;padding:1rem;background:white;border-radius:12px;">
        <img src="${img}" width="80" style="border-radius:8px;" onerror="this.src='https://via.placeholder.com/80'">
        <div style="flex:1;">
          <h4>${item.name}</h4>
          <p>MKW ${parseFloat(item.price).toLocaleString()} × ${item.qty}</p>
        </div>
        <b>MKW ${(item.price * item.qty).toLocaleString()}</b>
        <button class="btn" onclick="cart.splice(${i},1); loadCart(); updateCartCount();" style="background:#d32f2f;padding:0.5rem 1rem;">
          Remove
        </button>
      </div>
    `;
  }).join('');

  if (totalEl) {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalEl.textContent = total.toLocaleString();
  }
}

// Checkout
async function checkout() {
  const name = document.getElementById('name')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();

  if (!name || !phone || cart.length === 0) {
    return alert("Please fill name, phone, and add items to cart");
  }

  const items = cart.map(i => ({ flowerId: i.flower_id, quantity: i.qty }));

  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone_number: phone, items })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.removeItem('cart');
      cart = [];
      updateCartCount();
      alert(`Order placed successfully! Total: MKW ${data.total}\nWe will call you soon`);
      location.href = 'checkout.html?success=1';
    } else {
      alert("Order failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    alert("Network error. Is the backend running?");
  }
}

// Success message on checkout
if (location.pathname.includes('checkout.html') && new URLSearchParams(location.search).get('success')) {
  const form = document.getElementById('checkout-form');
  if (form) {
    form.innerHTML = '<h2 style="color:green;text-align:center;padding:4rem;">Order Placed Successfully!<br>We will call you soon</h2>';
  }
}


if (location.pathname.includes('index.html') || location.pathname === '/' || location.pathname.endsWith('/frontend/')) {
  loadFlowers();
}
if (location.pathname.includes('product.html')) loadProduct();
if (location.pathname.includes('cart.html')) loadCart();