/* ============================================================
   BREW HAVEN CAFE — Main Frontend Script
   ============================================================ */
"use strict";

const API = ""; // same-origin; just use relative paths

/* ============================================================
   UTILS
   ============================================================ */
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

function toast(msg, type = "info", duration = 3500) {
  const icons = { success: "✓", error: "✕", info: "☕" };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${icons[type] || "ℹ"}</span><span>${msg}</span>`;
  $("#toastContainer").appendChild(el);
  setTimeout(() => {
    el.style.animation = "fadeOutToast 0.35s ease forwards";
    el.addEventListener("animationend", () => el.remove());
  }, duration);
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

/* ============================================================
   LOADING SCREEN
   ============================================================ */
window.addEventListener("load", () => {
  setTimeout(() => {
    $("#loading-screen").classList.add("hidden");
  }, 900);
});

/* ============================================================
   NAVBAR
   ============================================================ */
const navbar = $("#navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 60);
  updateActiveLink();
}, { passive: true });

function updateActiveLink() {
  const sections = ["about", "menu", "reservation", "reviews", "gallery", "contact"];
  const scrollY = window.scrollY + 100;
  sections.forEach(id => {
    const sec = document.getElementById(id);
    if (!sec) return;
    const link = $(`.nav-links a[href="#${id}"]`);
    if (!link) return;
    const inView = scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle("active", inView);
  });
}

// Hamburger
const hamburger = $("#hamburger");
const navMobile = $("#navMobile");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMobile.classList.toggle("open");
});
$$(".mobile-link", navMobile).forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navMobile.classList.remove("open");
  });
});

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const suffix = el.dataset.suffix || "";
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      animateCounter(el, parseInt(el.dataset.target, 10));
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.4 });
$$(".stat-number").forEach(el => statsObserver.observe(el));

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

/* ============================================================
   CART STATE
   ============================================================ */
let cart = JSON.parse(localStorage.getItem("bhCart") || "[]");

function saveCart() {
  localStorage.setItem("bhCart", JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function renderCart() {
  const cartItems = $("#cartItems");
  const cartFooter = $("#cartFooter");
  const cartCount = $("#cartCount");
  const cartTotal = $("#cartTotal");
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  if (count > 0) {
    cartCount.style.display = "flex";
    cartCount.textContent = count;
    cartFooter.style.display = "block";
    cartTotal.textContent = `₹${total.toLocaleString()}`;
  } else {
    cartCount.style.display = "none";
    cartFooter.style.display = "none";
  }

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty"><span>☕</span>Nothing here yet.<br>Explore the menu!</div>`;
    return;
  }

  cartItems.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span>₹${(item.price * item.quantity).toLocaleString()}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="dec" data-idx="${idx}">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" data-action="inc" data-idx="${idx}">+</button>
      </div>
      <button class="cart-item-remove" data-idx="${idx}" title="Remove">✕</button>
    </div>
  `).join("");

  // qty buttons
  $$(".qty-btn", cartItems).forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx, 10);
      if (btn.dataset.action === "inc") {
        cart[idx].quantity++;
      } else {
        cart[idx].quantity--;
        if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      }
      saveCart(); renderCart();
    });
  });
  $$(".cart-item-remove", cartItems).forEach(btn => {
    btn.addEventListener("click", () => {
      cart.splice(parseInt(btn.dataset.idx, 10), 1);
      saveCart(); renderCart();
      toast("Item removed from order.", "info");
    });
  });
}

function addToCart(item) {
  const existing = cart.find(i => i._id === item._id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ _id: item._id, name: item.name, price: item.price, quantity: 1 });
  }
  saveCart(); renderCart();
  toast(`${item.name} added to order! ☕`, "success");
}

// Cart drawer
const cartOverlay = $("#cartOverlay");
const cartDrawer = $("#cartDrawer");
function openCart() { cartOverlay.classList.add("open"); cartDrawer.classList.add("open"); }
function closeCart() { cartOverlay.classList.remove("open"); cartDrawer.classList.remove("open"); }
$("#cartToggle").addEventListener("click", openCart);
$("#cartClose").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Initial render
renderCart();

/* ============================================================
   CHECKOUT
   ============================================================ */
const checkoutModal = $("#checkoutModal");
const coType = $("#coType");
const coAddressGroup = $("#coAddressGroup");

$("#checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) { toast("Your cart is empty.", "error"); return; }
  closeCart();
  // populate summary
  const itemsEl = $("#modalOrderItems");
  itemsEl.innerHTML = cart.map(i => `
    <div class="modal-order-item">
      <span>${i.name} × ${i.quantity}</span>
      <span>₹${(i.price * i.quantity).toLocaleString()}</span>
    </div>
  `).join("");
  $("#modalTotal").textContent = `₹${getCartTotal().toLocaleString()}`;
  checkoutModal.classList.add("open");
});
$("#cancelCheckout").addEventListener("click", () => checkoutModal.classList.remove("open"));
coType.addEventListener("change", () => {
  coAddressGroup.style.display = coType.value === "delivery" ? "block" : "none";
});

$("#confirmOrder").addEventListener("click", async () => {
  const name = $("#coName").value.trim();
  const phone = $("#coPhone").value.trim();
  if (!name || !phone) { toast("Name and phone are required.", "error"); return; }
  if (coType.value === "delivery" && !$("#coAddress").value.trim()) {
    toast("Please enter a delivery address.", "error"); return;
  }

  const btn = $("#confirmOrder");
  btn.classList.add("loading-btn");
  try {
    await apiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: name,
        phone,
        email: $("#coEmail").value.trim(),
        items: cart.map(i => ({ menuItem: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        totalAmount: getCartTotal(),
        orderType: coType.value,
        address: $("#coAddress")?.value?.trim() || "",
        paymentMethod: $("#coPayment").value,
      }),
    });
    cart = []; saveCart(); renderCart();
    checkoutModal.classList.remove("open");
    toast("🎉 Order placed! We'll prepare it right away.", "success", 5000);
    // Reset form
    ["coName","coPhone","coEmail","coAddress"].forEach(id => { const el = $(`#${id}`); if(el) el.value = ""; });
  } catch (err) {
    toast(`Order failed: ${err.message}`, "error");
  } finally {
    btn.classList.remove("loading-btn");
  }
});

/* ============================================================
   MENU
   ============================================================ */
let allMenuItems = [];
let activeCategory = "All";
let searchQuery = "";

async function loadMenu() {
  try {
    allMenuItems = await apiFetch("/api/menu");
    renderMenu();
  } catch {
    $("#menuGrid").innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--white-dim);font-family:var(--ff-serif);">Could not load menu. Please try again.</div>`;
  }
}

function renderMenu() {
  const filtered = allMenuItems.filter(item => {
    const catMatch = activeCategory === "All" || item.category === activeCategory;
    const searchMatch = !searchQuery || item.name.toLowerCase().includes(searchQuery) || (item.description || "").toLowerCase().includes(searchQuery);
    return catMatch && searchMatch;
  });

  if (filtered.length === 0) {
    $("#menuGrid").innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--white-dim);font-family:var(--ff-serif);">No items found.</div>`;
    return;
  }

  const emojiMap = { Coffee: "☕", Tea: "🍵", Snacks: "🥜", Desserts: "🍰", "Main Course": "🍽️", Beverages: "🥤" };

  $("#menuGrid").innerHTML = filtered.map(item => `
    <div class="menu-card" data-id="${item._id}">
      <div class="menu-card-img">
        <img src="${item.image || `https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=75`}"
             alt="${item.name}"
             onerror="this.src='https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=75'" />
        ${item.isFeatured ? `<span class="menu-card-badge">Featured</span>` : ""}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-cat">${emojiMap[item.category] || ""} ${item.category}</div>
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${item.description || ""}</p>
        <div class="menu-card-footer">
          <div class="menu-card-price">₹${item.price} <small>/item</small></div>
          <button class="add-to-cart" data-id="${item._id}">+ Add</button>
        </div>
      </div>
    </div>
  `).join("");

  $$(".add-to-cart", $("#menuGrid")).forEach(btn => {
    btn.addEventListener("click", () => {
      const item = allMenuItems.find(i => i._id === btn.dataset.id);
      if (item) addToCart(item);
    });
  });
}

// Filter tabs
$$(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderMenu();
  });
});

// Search
let searchDebounce;
$("#menuSearch").addEventListener("input", e => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderMenu();
  }, 280);
});

loadMenu();

/* ============================================================
   RESERVATION FORM
   ============================================================ */
// Set min date to today
const resDate = $("#resDate");
resDate.min = new Date().toISOString().split("T")[0];

$("#reservationForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#resSubmitBtn");
  btn.classList.add("loading-btn");
  try {
    await apiFetch("/api/reservations", {
      method: "POST",
      body: JSON.stringify({
        name: $("#resName").value.trim(),
        phone: $("#resPhone").value.trim(),
        email: $("#resEmail").value.trim(),
        date: resDate.value,
        time: $("#resTime").value,
        guests: $("#resGuests").value,
        specialRequest: $("#resRequest").value.trim(),
      }),
    });
    e.target.reset();
    toast("🎉 Reservation confirmed! We'll see you soon.", "success", 5000);
  } catch (err) {
    toast(`Reservation failed: ${err.message}`, "error");
  } finally {
    btn.classList.remove("loading-btn");
  }
});

/* ============================================================
   REVIEWS / TESTIMONIALS
   ============================================================ */
let reviewRating = 0;

// Star input
$$(".star-rating-input button").forEach(btn => {
  btn.addEventListener("click", () => {
    reviewRating = parseInt(btn.dataset.val, 10);
    $$(".star-rating-input button").forEach((b, i) => {
      b.classList.toggle("selected", i < reviewRating);
    });
  });
  btn.addEventListener("mouseenter", () => {
    const val = parseInt(btn.dataset.val, 10);
    $$(".star-rating-input button").forEach((b, i) => {
      b.style.color = i < val ? "var(--gold)" : "";
    });
  });
});
$("#starInput").addEventListener("mouseleave", () => {
  $$(".star-rating-input button").forEach((b, i) => {
    b.style.color = i < reviewRating ? "var(--gold)" : "";
  });
});

$("#reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!reviewRating) { toast("Please select a star rating.", "error"); return; }
  const btn = $("#revSubmitBtn");
  btn.classList.add("loading-btn");
  try {
    await apiFetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        name: $("#revName").value.trim(),
        rating: reviewRating,
        message: $("#revMessage").value.trim(),
      }),
    });
    e.target.reset();
    reviewRating = 0;
    $$(".star-rating-input button").forEach(b => b.classList.remove("selected"));
    toast("Thank you for your review! ⭐", "success", 5000);
    loadReviews();
  } catch (err) {
    toast(`Review failed: ${err.message}`, "error");
  } finally {
    btn.classList.remove("loading-btn");
  }
});

// Testimonial Carousel
let carouselIndex = 0;
let carouselItems = [];

function renderCarousel(reviews) {
  const track = $("#carouselTrack");
  const dots = $("#carouselDots");

  const fallback = [
    { name: "Sneha Rao", rating: 5, message: "Brew Haven is hands down the finest cafe experience in the city. The Gold Espresso is transcendent — bold, velvety, and somehow comforting all at once. I've been back seven times this month alone." },
    { name: "Vikram D'Souza", rating: 5, message: "From the moment you walk in, the atmosphere wraps around you like a warm blanket. Impeccable service, extraordinary food, and coffee that genuinely changes your morning." },
    { name: "Amara Joshi", rating: 5, message: "The Dark Chocolate Gold Tart paired with a Jasmine Pearl Tea is a combination I dream about. This place is ridiculously special." },
  ];

  carouselItems = reviews.length > 0 ? reviews : fallback;

  track.innerHTML = carouselItems.map(r => `
    <div class="testimonial-card">
      <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p class="testimonial-text">"${r.message}"</p>
      <div class="testimonial-author">
        <strong>${r.name}</strong>
        <span>Verified Guest</span>
      </div>
    </div>
  `).join("");

  dots.innerHTML = carouselItems.map((_, i) => `
    <div class="carousel-dot ${i === 0 ? "active" : ""}" data-idx="${i}"></div>
  `).join("");

  $$(".carousel-dot", dots).forEach(dot => {
    dot.addEventListener("click", () => goToSlide(parseInt(dot.dataset.idx, 10)));
  });
}

function goToSlide(idx) {
  carouselIndex = (idx + carouselItems.length) % carouselItems.length;
  $("#carouselTrack").style.transform = `translateX(-${carouselIndex * 100}%)`;
  $$(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === carouselIndex));
}

// Auto-advance
setInterval(() => { if (carouselItems.length > 1) goToSlide(carouselIndex + 1); }, 5000);

async function loadReviews() {
  try {
    const reviews = await apiFetch("/api/reviews");
    renderCarousel(reviews);
  } catch {
    renderCarousel([]);
  }
}
loadReviews();

/* ============================================================
   GALLERY LIGHTBOX
   ============================================================ */
const lightbox = $("#lightbox");
const lightboxImg = $("#lightboxImg");
let galleryImgs = [];
let lightboxIdx = 0;

$$(".gallery-item").forEach((item, idx) => {
  galleryImgs.push(item.querySelector("img").src);
  item.addEventListener("click", () => openLightbox(idx));
});

function openLightbox(idx) {
  lightboxIdx = idx;
  lightboxImg.src = galleryImgs[idx];
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}
$("#lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
$("#lightboxPrev").addEventListener("click", (e) => {
  e.stopPropagation();
  openLightbox((lightboxIdx - 1 + galleryImgs.length) % galleryImgs.length);
});
$("#lightboxNext").addEventListener("click", (e) => {
  e.stopPropagation();
  openLightbox((lightboxIdx + 1) % galleryImgs.length);
});
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox((lightboxIdx - 1 + galleryImgs.length) % galleryImgs.length);
  if (e.key === "ArrowRight") openLightbox((lightboxIdx + 1) % galleryImgs.length);
});

/* ============================================================
   CONTACT FORM
   ============================================================ */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

$("#contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#ctEmail").value.trim();
  if (!EMAIL_RE.test(email)) { toast("Please enter a valid email address.", "error"); return; }
  const btn = $("#ctSubmitBtn");
  btn.classList.add("loading-btn");
  try {
    await apiFetch("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: $("#ctName").value.trim(),
        email,
        subject: $("#ctSubject").value.trim() || "General Inquiry",
        message: $("#ctMessage").value.trim(),
      }),
    });
    e.target.reset();
    toast("Message sent! We'll be in touch soon. ☕", "success", 5000);
  } catch (err) {
    toast(`Failed to send: ${err.message}`, "error");
  } finally {
    btn.classList.remove("loading-btn");
  }
});

/* ============================================================
   NEWSLETTER
   ============================================================ */
$("#newsletterForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("#nlEmail").value.trim();
  if (!EMAIL_RE.test(email)) { toast("Please enter a valid email address.", "error"); return; }
  const btn = e.target.querySelector("button");
  btn.classList.add("loading-btn");
  try {
    const data = await apiFetch("/api/contact/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    e.target.reset();
    toast(data.message || "Subscribed! 🎉", "success");
  } catch (err) {
    toast(`Subscription failed: ${err.message}`, "error");
  } finally {
    btn.classList.remove("loading-btn");
  }
});

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
