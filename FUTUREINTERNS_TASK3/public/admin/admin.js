/* ============================================================
   BREW HAVEN CAFE — Admin Dashboard Script
   ============================================================ */
"use strict";

/* ==================== UTILS ==================== */
function $(sel, ctx = document) { return ctx.querySelector(sel); }
function $$(sel, ctx = document) { return [...ctx.querySelectorAll(sel)]; }

let adminToken = localStorage.getItem("bhAdminToken") || "";

async function api(path, opts = {}) {
  const res = await fetch("/api" + path, {
    headers: {
      "Content-Type": "application/json",
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      ...opts.headers,
    },
    ...opts,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

function toast(msg, type = "info") {
  const icons = { success: "✓", error: "✕", info: "☕" };
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<span style="font-size:1rem;">${icons[type]}</span><span>${msg}</span>`;
  $("#adminToastContainer").appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

function fmt(date) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function badge(status) {
  return `<span class="badge badge-${status}">${status}</span>`;
}

function shortText(str, max = 60) {
  if (!str) return "—";
  return str.length > max ? str.substring(0, max) + "…" : str;
}

/* ==================== AUTH ==================== */
const loginPage = $("#loginPage");
const adminApp = $("#adminApp");

function showApp(user) {
  loginPage.style.display = "none";
  adminApp.classList.add("visible");
  if (user) {
    $("#adminName").textContent = user.name || "Admin";
    $("#adminEmail").textContent = user.email || "";
  }
  loadCurrentPage();
}

function showLogin() {
  adminApp.classList.remove("visible");
  loginPage.style.display = "flex";
  adminToken = "";
  localStorage.removeItem("bhAdminToken");
}

// Check existing token
(async () => {
  if (adminToken) {
    try {
      const user = await api("/auth/me");
      showApp(user);
    } catch {
      showLogin();
    }
  }
})();

$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = $("#loginBtn");
  const err = $("#loginError");
  err.style.display = "none";
  btn.textContent = "Signing in…";
  try {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: $("#loginEmail").value.trim(),
        password: $("#loginPassword").value,
      }),
    });
    adminToken = data.token;
    localStorage.setItem("bhAdminToken", adminToken);
    showApp(data.user);
  } catch (err_) {
    err.textContent = err_.message;
    err.style.display = "block";
  } finally {
    btn.textContent = "Sign In";
  }
});

$("#logoutBtn").addEventListener("click", () => {
  if (confirm("Sign out of the admin dashboard?")) showLogin();
});

/* ==================== NAVIGATION ==================== */
let currentPage = "dashboard";

function navigate(page) {
  currentPage = page;
  // deactivate all
  $$(".admin-page").forEach(p => p.classList.remove("active"));
  $$(".sidebar-link").forEach(l => l.classList.remove("active"));
  // activate
  const pageEl = $(`#page-${page}`);
  if (pageEl) pageEl.classList.add("active");
  const linkEl = $(`.sidebar-link[data-page="${page}"]`);
  if (linkEl) linkEl.classList.add("active");
  // update title
  const titles = {
    dashboard: "Dashboard",
    orders: "Orders",
    reservations: "Reservations",
    menu: "Menu Items",
    reviews: "Reviews",
    messages: "Contact Messages",
  };
  $("#pageTitle").textContent = titles[page] || page;
  loadCurrentPage();
}

$$(".sidebar-link[data-page]").forEach(link => {
  link.addEventListener("click", () => navigate(link.dataset.page));
});

function loadCurrentPage() {
  switch (currentPage) {
    case "dashboard":   loadDashboard();    break;
    case "orders":      loadOrders();       break;
    case "reservations":loadReservations(); break;
    case "menu":        loadMenuItems();    break;
    case "reviews":     loadReviews();      break;
    case "messages":    loadMessages();     break;
  }
}

$("#refreshBtn").addEventListener("click", loadCurrentPage);

/* ==================== DASHBOARD ==================== */
async function loadDashboard() {
  try {
    const [summary, monthlyOrders, resTrends, orders] = await Promise.all([
      api("/analytics/summary"),
      api("/analytics/monthly-orders"),
      api("/analytics/reservation-trends"),
      api("/orders"),
    ]);

    // Stat cards
    $("#sc-orders").textContent      = summary.totalOrders.toLocaleString();
    $("#sc-reservations").textContent= summary.totalReservations.toLocaleString();
    $("#sc-customers").textContent   = summary.totalCustomers.toLocaleString();
    $("#sc-revenue").textContent     = `₹${summary.revenue.toLocaleString()}`;

    // Monthly Orders chart
    renderBarChart("#ordersChart", monthlyOrders, "orders", "gold");
    // Reservation Trends chart
    renderBarChart("#reservationsChart", resTrends, "reservations", "blue");

    // Recent orders (last 5)
    renderRecentOrders(orders.slice(0, 5));
  } catch (err) {
    toast("Failed to load dashboard: " + err.message, "error");
  }
}

function renderBarChart(selector, data, key, color) {
  const container = $(selector);
  if (!container || !data.length) return;
  const max = Math.max(...data.map(d => d[key] || 0)) || 1;
  container.innerHTML = data.map(d => {
    const val = d[key] || 0;
    const pct = Math.max((val / max) * 100, val > 0 ? 4 : 0);
    return `
      <div class="chart-bar-group" title="${val} ${key} in ${d.label}">
        <div class="chart-bar ${key === 'orders' ? 'orders' : 'reservations'}"
             style="height:${pct}%;"></div>
        <div style="font-size:0.65rem;color:var(--text-dim);margin-top:4px;">${d.label}</div>
        <div style="font-size:0.7rem;color:var(--${color === 'gold' ? 'gold' : 'blue'});">${val}</div>
      </div>`;
  }).join("");
}

function renderRecentOrders(orders) {
  const tbody = $("#recentOrdersBody");
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa fa-inbox"></i>No orders yet.</div></td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr>
      <td><strong>${o.customerName}</strong></td>
      <td>${o.items.map(i => i.name).join(", ").substring(0, 40)}…</td>
      <td>₹${o.totalAmount.toLocaleString()}</td>
      <td><span style="text-transform:capitalize;">${o.orderType}</span></td>
      <td>${badge(o.status)}</td>
      <td>${fmtDate(o.createdAt)}</td>
    </tr>
  `).join("");
}

/* ==================== ORDERS ==================== */
let allOrders = [];

async function loadOrders() {
  try {
    allOrders = await api("/orders");
    renderOrdersTable(allOrders);
  } catch (err) {
    toast("Failed to load orders: " + err.message, "error");
  }
}

function renderOrdersTable(orders) {
  const tbody = $("#ordersTableBody");
  if (!orders.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fa fa-inbox"></i>No orders found.</div></td></tr>`;
    return;
  }
  tbody.innerHTML = orders.map(o => `
    <tr data-id="${o._id}">
      <td><strong>${o.customerName}</strong></td>
      <td>${o.phone}</td>
      <td>${o.items.map(i => `${i.name}×${i.quantity}`).join(", ").substring(0, 50)}</td>
      <td>₹${o.totalAmount.toLocaleString()}</td>
      <td>${o.orderType}</td>
      <td>
        <select class="order-status-select" data-id="${o._id}" style="background:transparent;border:1px solid var(--border);color:var(--text);padding:4px 8px;border-radius:4px;font-size:0.8rem;">
          ${["pending","preparing","ready","completed","cancelled"].map(s =>
            `<option value="${s}" ${o.status===s?"selected":""}>${s}</option>`
          ).join("")}
        </select>
      </td>
      <td>${fmtDate(o.createdAt)}</td>
      <td>
        <button class="btn-sm btn-danger-sm delete-order" data-id="${o._id}" title="Delete"><i class="fa fa-trash"></i></button>
      </td>
    </tr>
  `).join("");

  $$(".order-status-select", tbody).forEach(sel => {
    sel.addEventListener("change", async () => {
      try {
        await api(`/orders/${sel.dataset.id}/status`, {
          method: "PUT", body: JSON.stringify({ status: sel.value }),
        });
        toast("Order status updated.", "success");
      } catch (err) {
        toast("Failed: " + err.message, "error");
      }
    });
  });
  $$(".delete-order", tbody).forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this order?")) return;
      try {
        await api(`/orders/${btn.dataset.id}`, { method: "DELETE" });
        toast("Order deleted.", "success");
        loadOrders();
      } catch (err) {
        toast("Failed: " + err.message, "error");
      }
    });
  });
}

let orderSearchTimeout;
$("#orderSearch").addEventListener("input", e => {
  clearTimeout(orderSearchTimeout);
  orderSearchTimeout = setTimeout(() => {
    const q = e.target.value.toLowerCase();
    renderOrdersTable(allOrders.filter(o =>
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q)
    ));
  }, 250);
});

/* ==================== RESERVATIONS ==================== */
let allReservations = [];

async function loadReservations() {
  try {
    allReservations = await api("/reservations");
    renderResTable(allReservations);
  } catch (err) {
    toast("Failed to load reservations: " + err.message, "error");
  }
}

function renderResTable(reservations) {
  const tbody = $("#resTableBody");
  if (!reservations.length) {
    tbody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><i class="fa fa-calendar"></i>No reservations found.</div></td></tr>`;
    return;
  }
  tbody.innerHTML = reservations.map(r => `
    <tr>
      <td><strong>${r.name}</strong></td>
      <td>${r.phone}</td>
      <td>${r.date}</td>
      <td>${r.time}</td>
      <td>${r.guests}</td>
      <td>${shortText(r.specialRequest, 40)}</td>
      <td>
        <select class="res-status-select" data-id="${r._id}" style="background:transparent;border:1px solid var(--border);color:var(--text);padding:4px 8px;border-radius:4px;font-size:0.8rem;">
          ${["pending","confirmed","cancelled","completed"].map(s =>
            `<option value="${s}" ${r.status===s?"selected":""}>${s}</option>`
          ).join("")}
        </select>
      </td>
      <td>
        <button class="btn-sm btn-danger-sm delete-res" data-id="${r._id}" title="Delete"><i class="fa fa-trash"></i></button>
      </td>
    </tr>
  `).join("");

  $$(".res-status-select", tbody).forEach(sel => {
    sel.addEventListener("change", async () => {
      try {
        await api(`/reservations/${sel.dataset.id}/status`, {
          method: "PUT", body: JSON.stringify({ status: sel.value }),
        });
        toast("Reservation updated.", "success");
      } catch (err) {
        toast("Failed: " + err.message, "error");
      }
    });
  });
  $$(".delete-res", tbody).forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this reservation?")) return;
      try {
        await api(`/reservations/${btn.dataset.id}`, { method: "DELETE" });
        toast("Reservation deleted.", "success");
        loadReservations();
      } catch (err) {
        toast("Failed: " + err.message, "error");
      }
    });
  });
}

let resSearchTimeout;
$("#resSearch").addEventListener("input", e => {
  clearTimeout(resSearchTimeout);
  resSearchTimeout = setTimeout(() => {
    const q = e.target.value.toLowerCase();
    renderResTable(allReservations.filter(r =>
      r.name.toLowerCase().includes(q) || r.phone.includes(q)
    ));
  }, 250);
});

$("#exportCsvBtn").addEventListener("click", () => {
  window.open("/api/reservations/export/csv", "_blank");
});

/* ==================== MENU ITEMS ==================== */
let allMenuItemsAdmin = [];
let editingMenuId = null;

async function loadMenuItems() {
  try {
    allMenuItemsAdmin = await api("/menu");
    renderMenuTable(allMenuItemsAdmin);
  } catch (err) {
    toast("Failed to load menu: " + err.message, "error");
  }
}

function renderMenuTable(items) {
  const tbody = $("#menuTableBody");
  if (!items.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa fa-utensils"></i>No menu items found.</div></td></tr>`;
    return;
  }
  tbody.innerHTML = items.map(item => `
    <tr>
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td>₹${item.price}</td>
      <td><span style="color:${item.isAvailable ? 'var(--green)':'var(--red)'};">${item.isAvailable ? "Yes" : "No"}</span></td>
      <td>${item.isFeatured ? "⭐" : "—"}</td>
      <td style="display:flex;gap:6px;align-items:center;">
        <button class="btn-sm btn-outline-sm edit-menu" data-id="${item._id}" title="Edit">
          <i class="fa fa-pencil-alt"></i>
        </button>
        <button class="btn-sm btn-danger-sm delete-menu" data-id="${item._id}" title="Delete">
          <i class="fa fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join("");

  $$(".edit-menu", tbody).forEach(btn => {
    btn.addEventListener("click", () => openMenuModal(btn.dataset.id));
  });
  $$(".delete-menu", tbody).forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this menu item?")) return;
      try {
        await api(`/menu/${btn.dataset.id}`, { method: "DELETE" });
        toast("Menu item deleted.", "success");
        loadMenuItems();
      } catch (err) {
        toast("Failed: " + err.message, "error");
      }
    });
  });
}

let menuSearchTimeout;
$("#menuSearch").addEventListener("input", e => {
  clearTimeout(menuSearchTimeout);
  menuSearchTimeout = setTimeout(() => {
    const q = e.target.value.toLowerCase();
    renderMenuTable(allMenuItemsAdmin.filter(i =>
      i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    ));
  }, 250);
});

function openMenuModal(id = null) {
  editingMenuId = id;
  const modal = $("#menuItemModal");
  modal.classList.add("open");
  if (id) {
    const item = allMenuItemsAdmin.find(i => i._id === id);
    if (!item) return;
    $("#menuItemModalTitle").textContent = "Edit Menu Item";
    $("#miName").value        = item.name;
    $("#miCategory").value    = item.category;
    $("#miPrice").value       = item.price;
    $("#miDescription").value = item.description || "";
    $("#miImage").value       = item.image || "";
    $("#miAvailable").checked = item.isAvailable;
    $("#miFeatured").checked  = item.isFeatured;
  } else {
    $("#menuItemModalTitle").textContent = "Add Menu Item";
    ["miName","miCategory","miPrice","miDescription","miImage"].forEach(id => {
      const el = $(`#${id}`);
      if (el) el.value = "";
    });
    $("#miAvailable").checked = true;
    $("#miFeatured").checked  = false;
  }
}
function closeMenuModal() {
  $("#menuItemModal").classList.remove("open");
  editingMenuId = null;
}
$("#addMenuItemBtn").addEventListener("click", () => openMenuModal());
$("#cancelMenuModal").addEventListener("click", closeMenuModal);
$("#menuItemModal").addEventListener("click", e => { if (e.target === $("#menuItemModal")) closeMenuModal(); });

$("#saveMenuItemBtn").addEventListener("click", async () => {
  const name     = $("#miName").value.trim();
  const category = $("#miCategory").value;
  const price    = parseFloat($("#miPrice").value);
  if (!name || !category || isNaN(price)) {
    toast("Name, category and price are required.", "error");
    return;
  }
  const payload = {
    name, category, price,
    description: $("#miDescription").value.trim(),
    image: $("#miImage").value.trim(),
    isAvailable: $("#miAvailable").checked,
    isFeatured: $("#miFeatured").checked,
  };
  const btn = $("#saveMenuItemBtn");
  btn.textContent = "Saving…";
  try {
    if (editingMenuId) {
      await api(`/menu/${editingMenuId}`, { method: "PUT", body: JSON.stringify(payload) });
      toast("Menu item updated.", "success");
    } else {
      await api("/menu", { method: "POST", body: JSON.stringify(payload) });
      toast("Menu item added.", "success");
    }
    closeMenuModal();
    loadMenuItems();
  } catch (err) {
    toast("Failed: " + err.message, "error");
  } finally {
    btn.textContent = "Save Item";
  }
});

/* ==================== REVIEWS ==================== */
async function loadReviews() {
  try {
    const reviews = await api("/reviews");
    const tbody = $("#reviewsTableBody");
    if (!reviews.length) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fa fa-star"></i>No reviews yet.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = reviews.map(r => `
      <tr>
        <td><strong>${r.name}</strong></td>
        <td>${"★".repeat(r.rating)}<span style="color:var(--border);">${"★".repeat(5-r.rating)}</span></td>
        <td>${shortText(r.message)}</td>
        <td>${fmtDate(r.createdAt)}</td>
        <td>
          <button class="btn-sm btn-danger-sm delete-review" data-id="${r._id}" title="Delete">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join("");
    $$(".delete-review", tbody).forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this review?")) return;
        try {
          await api(`/reviews/${btn.dataset.id}`, { method: "DELETE" });
          toast("Review deleted.", "success");
          loadReviews();
        } catch (err) {
          toast("Failed: " + err.message, "error");
        }
      });
    });
  } catch (err) {
    toast("Failed to load reviews: " + err.message, "error");
  }
}

/* ==================== MESSAGES ==================== */
async function loadMessages() {
  try {
    const msgs = await api("/contact");
    const tbody = $("#messagesTableBody");
    if (!msgs.length) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fa fa-envelope"></i>No messages yet.</div></td></tr>`;
      return;
    }
    tbody.innerHTML = msgs.map(m => `
      <tr style="${m.isRead ? '' : 'font-weight:500;'}">
        <td><strong>${m.name}</strong>${m.isRead ? '' : ' <span style="color:var(--gold);font-size:0.7rem;">NEW</span>'}</td>
        <td>${m.email}</td>
        <td>${shortText(m.subject, 30)}</td>
        <td>${shortText(m.message)}</td>
        <td>${fmtDate(m.createdAt)}</td>
        <td style="display:flex;gap:6px;">
          ${!m.isRead ? `<button class="btn-sm btn-outline-sm mark-read" data-id="${m._id}" title="Mark read"><i class="fa fa-check"></i></button>` : ""}
          <button class="btn-sm btn-danger-sm delete-msg" data-id="${m._id}" title="Delete"><i class="fa fa-trash"></i></button>
        </td>
      </tr>
    `).join("");
    $$(".mark-read", tbody).forEach(btn => {
      btn.addEventListener("click", async () => {
        try {
          await api(`/contact/${btn.dataset.id}/read`, { method: "PUT" });
          toast("Marked as read.", "success");
          loadMessages();
        } catch (err) {
          toast("Failed: " + err.message, "error");
        }
      });
    });
    $$(".delete-msg", tbody).forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this message?")) return;
        try {
          await api(`/contact/${btn.dataset.id}`, { method: "DELETE" });
          toast("Message deleted.", "success");
          loadMessages();
        } catch (err) {
          toast("Failed: " + err.message, "error");
        }
      });
    });
  } catch (err) {
    toast("Failed to load messages: " + err.message, "error");
  }
}
