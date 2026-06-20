<div align="center">

# ☕ Brew Haven Cafe
### FUTUREINTERNS\_TASK3 — Full-Stack Luxury Cafe & Restaurant Website

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

> A complete **production-ready full-stack** luxury cafe & restaurant website built for **FUTUREINTERNS Task 3**.
> Features online ordering, table reservations, reviews, gallery, newsletter, and a full admin dashboard with analytics — all wired to MongoDB.

[🌐 Live Demo](#) · [🐛 Report Bug](#) · [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [🔑 Admin Credentials](#-admin-credentials)
- [🌟 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📁 Project Architecture](#-project-architecture)
- [🚀 Installation & Setup](#-installation--setup)
- [🌱 Database Seeding](#-database-seeding)
- [🔌 API Endpoints](#-api-endpoints)
- [📦 Menu Categories](#-menu-categories)
- [🎨 Design System](#-design-system)
- [🗄 Database Schema](#-database-schema)
- [❓ Troubleshooting](#-troubleshooting)
- [🔮 Future Enhancements](#-future-enhancements)
- [👤 Author](#-author)

---

## 🔑 Admin Credentials

```
Admin Dashboard URL : http://localhost:5000/admin/
Email               : admin@brewhaven.com
Password            : admin123
```

> ✅ **No setup needed.** Just run `npm install && npm start` — the server auto-creates the admin account
> and seeds all 32 menu items on first startup. No separate seed command required.

---

## 🌟 Project Overview

**Brew Haven Cafe** is a premium full-stack web application that functions as a complete real-world business website for a luxury cafe and restaurant. It combines a visually stunning black-and-gold frontend with a robust Node.js/Express backend and MongoDB database.

### What makes this stand out from a basic cafe website:

| Feature | Basic Website | Brew Haven Cafe |
|---------|:---:|:---:|
| Static HTML pages | ✅ | ✅ |
| Real database (MongoDB) | ❌ | ✅ |
| Online ordering with cart | ❌ | ✅ |
| Live table reservations | ❌ | ✅ |
| Admin dashboard | ❌ | ✅ |
| JWT authentication | ❌ | ✅ |
| Analytics & charts | ❌ | ✅ |
| REST API (30+ endpoints) | ❌ | ✅ |
| Auto-seeding database | ❌ | ✅ |
| Export to CSV | ❌ | ✅ |

---

## ✨ Features

### 🏠 Homepage
- **Full-screen hero section** with parallax-style dark background, animated gold typography and dual call-to-action buttons
- **Animated statistics counter** — cups served daily, menu items, guest satisfaction %, years of excellence
- **Smooth scroll-reveal animations** on every section as the user scrolls down
- **Sticky navbar** that becomes frosted glass on scroll with active link highlighting
- **Mobile hamburger menu** with full-screen overlay navigation

### 👥 About Section
- Business origin story with founder narrative
- Mission & vision with styled content pillars
- **Team cards** with hover zoom effect — Co-Founders, Head Barista, General Manager
- Ingredient/philosophy pills (Single-Origin Beans, In-House Roasting, Seasonal Menu, etc.)
- Animated badge showing years of excellence

### 🍽 Menu System
- **32 professionally curated items** across 6 categories loaded dynamically from MongoDB
- **Real-time category filter tabs** — All / Coffee / Tea / Main Course / Snacks / Desserts / Beverages
- **Live search bar** with 280ms debounce — filters by name and description instantly
- **Menu cards** with high-quality Unsplash images, category emoji, description, price and Add to Cart button
- Hover zoom on card images with gold border glow effect
- Featured badges on selected items
- "Bestseller" and "New" tags

### 🛒 Online Ordering
- **Cart drawer** slides in from the right with overlay backdrop
- **Quantity controls** (+ / −) per item with real-time total update
- **Cart counter badge** on the navbar bag icon
- Cart state **persisted in localStorage** across page refreshes
- **Checkout modal** with:
  - Customer name, phone, email fields
  - Order type selector (Pickup / Delivery)
  - Delivery address field (shown only when Delivery is selected)
  - Payment method (Cash / Card / Online)
  - Live order summary with all items and grand total
- **Order confirmation** — order stored in MongoDB, cart cleared, toast notification shown

### 📅 Table Reservation System
- Full reservation form with **name, phone, email, date, time, guest count, special requests**
- Date input restricted to today onwards (no past dates)
- **Stored in MongoDB** with full status tracking
- Admin can update status: `pending → confirmed → cancelled → completed`
- Opening hours displayed alongside the form

### ⭐ Reviews & Testimonials
- **Testimonial carousel** auto-advances every 5 seconds with dot navigation
- Reviews fetched live from MongoDB (falls back to curated defaults if DB is empty)
- **Star rating input** with hover highlight and click-to-select
- **Review submission form** — name, star rating, message — saved to MongoDB
- Toast confirmation on submission

### 🖼 Gallery
- **9-image masonry grid** with creative spanning layout
- **Hover overlay** with zoom effect and icon reveal
- **Lightbox popup** — full-screen image viewer
- **Keyboard navigation** — arrow keys to prev/next, Escape to close
- Prev / Next buttons in lightbox

### 📞 Contact Page
- Contact form with **client-side email validation** — saved to MongoDB
- **Google Maps embed** with dark theme filter
- Opening hours card
- Address, phone, email contact details with icon cards

### 📧 Newsletter
- Email subscription form with duplicate detection
- Subscriptions stored in MongoDB
- Toast confirmation for new and existing subscribers

### 🟢 WhatsApp Float Button
- Fixed bottom-left button pre-filled with a greeting message
- Opens WhatsApp chat directly on click

### 🔔 Toast Notifications
- Non-blocking corner notifications for every user action
- Three types: success (green), error (red), info (gold)
- Auto-dismiss after 3.5 seconds with slide-out animation

---

### 🔐 Admin Dashboard (`/admin/`)

#### Login Page
- JWT-secured login form
- **Credential hint box** displayed on the page with default email and password
- Token stored in localStorage for persistent session
- Auto-redirect to dashboard after successful login

#### 📊 Analytics Dashboard
- **4 KPI stat cards:**
  - Total Orders (all time)
  - Total Reservations (all time)
  - Total Customers (unique phone numbers across orders + reservations)
  - Total Revenue (sum of all order amounts in ₹)
- **Monthly Orders bar chart** — last 6 months with order count and colour-coded bars
- **Reservation Trends bar chart** — last 6 months reservation volume
- **Recent Orders mini-table** — last 5 orders at a glance

#### 📦 Orders Management
- Full orders table with customer name, phone, items summary, amount, order type, status, date
- **Inline status dropdown** — update from `pending → preparing → ready → completed → cancelled` without leaving the page
- **Search orders** by customer name or phone
- Delete orders with confirmation prompt

#### 📅 Reservations Management
- Full reservations table with all fields
- **Inline status dropdown** — `pending → confirmed → cancelled → completed`
- **Search** by guest name or phone
- Delete with confirmation
- **Export to CSV** — one-click download of all reservations as a spreadsheet

#### 🍽 Menu Management
- Full menu items table with name, category, price, availability, featured status
- **Add New Item modal** — name, category (all 6), price, description, image URL, available toggle, featured toggle
- **Edit existing items** — modal pre-populated with current values
- **Delete items** with confirmation
- **Search menu items** by name or category

#### ⭐ Reviews Management
- All guest reviews with star display, message preview, date
- Delete reviews with confirmation

#### ✉ Contact Messages
- All contact form submissions with name, email, subject, message, date
- **Mark as Read** button — unread messages shown with "NEW" badge
- Delete messages with confirmation

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic page structure |
| CSS3 (1,200+ lines) | Black + gold luxury theme, glassmorphism, animations |
| Vanilla JavaScript (ES6+) | All interactivity — cart, API calls, animations, forms |
| Google Fonts | Playfair Display, Cormorant Garamond, Jost |
| Font Awesome 6 | Icons throughout the UI |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | JavaScript runtime |
| Express.js 4 | HTTP server and routing |
| MongoDB | NoSQL database |
| Mongoose | ODM — schema definitions and queries |
| jsonwebtoken | JWT generation and verification |
| bcryptjs | Password hashing (10 salt rounds) |
| cors | Cross-origin request handling |
| dotenv | Environment variable loading |

---

## 📁 Project Architecture

```
FUTUREINTERNS_TASK3/
│
├── 📄 server.js                    # Entry point — Express app, middleware, routes,
│                                   # auto-seed on first startup
├── 📄 package.json                 # Dependencies and npm scripts
├── 📄 .env.example                 # Environment variable template
├── 📄 .gitignore
│
├── 📂 config/
│   └── db.js                       # MongoDB connection with error handling
│
├── 📂 middleware/
│   └── authMiddleware.js           # JWT protect() — guards all admin API routes
│
├── 📂 models/                      # Mongoose schemas (7 collections)
│   ├── User.js                     # Admin users — bcrypt hashed passwords, role field
│   ├── MenuItem.js                 # Menu items — name, description, price, category,
│   │                               # image, isAvailable, isFeatured, tags
│   ├── Reservation.js              # Table bookings — name, phone, date, time,
│   │                               # guests, specialRequest, status
│   ├── Order.js                    # Customer orders — items snapshot, totalAmount,
│   │                               # orderType, address, paymentMethod, status
│   ├── Review.js                   # Guest reviews — name, rating (1-5), message, isApproved
│   ├── ContactMessage.js           # Contact form — name, email, subject, message, isRead
│   └── Subscriber.js               # Newsletter — email (unique)
│
├── 📂 controllers/                 # Business logic (7 files, 30+ functions)
│   ├── authController.js           # login, getMe, register
│   ├── menuController.js           # getMenuItems, getMenuItem, create, update, delete
│   ├── reservationController.js    # create, getAll, updateStatus, delete, exportCSV
│   ├── orderController.js          # create, getAll, updateStatus, delete
│   ├── reviewController.js         # getAll, create, delete
│   ├── contactController.js        # create, getAll, markRead, delete, subscribe
│   └── analyticsController.js      # getSummary, getMonthlyOrders, getReservationTrends
│
├── 📂 routes/                      # Express routers (7 files)
│   ├── authRoutes.js               # POST /login, GET /me, POST /register
│   ├── menuRoutes.js               # GET /, GET /:id, POST /, PUT /:id, DELETE /:id
│   ├── reservationRoutes.js        # POST /, GET /, PUT /:id/status, DELETE /, GET /export/csv
│   ├── orderRoutes.js              # POST /, GET /, PUT /:id/status, DELETE /:id
│   ├── reviewRoutes.js             # GET /, POST /, DELETE /:id
│   ├── contactRoutes.js            # POST /, POST /subscribe, GET /, PUT /:id/read, DELETE /:id
│   └── analyticsRoutes.js          # GET /summary, GET /monthly-orders, GET /reservation-trends
│
├── 📂 seed/
│   └── seed.js                     # Standalone seed script — run with `npm run seed`
│                                   # Creates admin + 32 menu items (safe to re-run)
│
└── 📂 public/                      # Static files served by Express
    ├── index.html                  # Full single-page public website
    ├── 📂 css/
    │   └── style.css               # 1,200+ line luxury theme with CSS variables,
    │                               # glassmorphism cards, animations, full responsive
    ├── 📂 js/
    │   └── main.js                 # All frontend JS — cart state, API fetches,
    │                               # scroll reveal, counters, lightbox, form handling
    ├── 📂 images/                  # Local image folder (optional — items use Unsplash URLs)
    └── 📂 admin/
        ├── index.html              # Admin dashboard — login + full SPA
        ├── admin.css               # Dark luxury admin theme with sidebar layout
        └── admin.js                # JWT auth, all CRUD tables, bar charts,
                                    # modals, search, export
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v18 or higher — check with `node -v`
- **MongoDB** — either:
  - Local: install MongoDB Community and run `mongod`
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free tier (M0)

### Step 1 — Extract and enter the project folder

```bash
cd FUTUREINTERNS_TASK3
```

### Step 2 — Install all dependencies

```bash
npm install
```

This installs: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `nodemon`

### Step 3 — Start the server

```bash
npm start
```

**That's it.** No `.env` file needed, no seed command needed. On first startup the server will:

1. Connect to MongoDB at `mongodb://127.0.0.1:27017/brewhaven`
2. Auto-create the admin account (`admin@brewhaven.com` / `admin123`)
3. Auto-insert all 32 menu items across 6 categories
4. Print a startup summary with all URLs and credentials

Expected terminal output:
```
[MongoDB] Connected: 127.0.0.1/brewhaven
[AutoSeed] ✅ Admin created → admin@brewhaven.com / admin123
[AutoSeed] ✅ Inserted 32 menu items across 6 categories

  ╔══════════════════════════════════════════════╗
  ║        BREW HAVEN CAFE — Ready! ☕            ║
  ╠══════════════════════════════════════════════╣
  ║  Site:     http://localhost:5000              ║
  ║  Admin:    http://localhost:5000/admin/       ║
  ║  Email:    admin@brewhaven.com                ║
  ║  Password: admin123                           ║
  ╚══════════════════════════════════════════════╝

☕  Server listening on http://localhost:5000
```

### Step 4 — Open in browser

| URL | What you'll see |
|-----|-----------------|
| `http://localhost:5000` | Full public cafe website |
| `http://localhost:5000/admin/` | Admin dashboard login |
| `http://localhost:5000/api/health` | API health check JSON |

### Optional — Development mode (auto-restart)

```bash
npm run dev
```

### Optional — Configure environment variables

If you want to customise settings, create a `.env` file:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
# MongoDB connection
MONGO_URI=mongodb://127.0.0.1:27017/brewhaven

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/brewhaven

# JWT (app works without this — a secure default is built in)
JWT_SECRET=your_own_super_secret_key_here
JWT_EXPIRES_IN=7d

# Server
PORT=5000

# Admin account (auto-created on startup)
ADMIN_NAME=Brew Haven Admin
ADMIN_EMAIL=admin@brewhaven.com
ADMIN_PASSWORD=admin123
```

---

## 🌱 Database Seeding

### Automatic (default behaviour)
The server seeds automatically on startup if the database is empty. **No action needed.**

### Manual seed (optional)
If you want to reset the database and re-insert all items:

```bash
npm run seed
```

This will:
- ✅ Create or reset the admin user
- ✅ Drop all existing menu items and re-insert all 32
- ✅ Print a confirmation table

> Safe to run multiple times — it always brings the database to a clean known state.

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api`. Admin-protected endpoints require the header:
```
Authorization: Bearer <token>
```
Get the token from `POST /api/auth/login`.

### 🔐 Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/login` | — | Login with email + password → returns JWT token |
| `GET` | `/api/auth/me` | ✅ | Returns current logged-in admin info |
| `POST` | `/api/auth/register` | — | Create admin account (first-time setup only) |

### 🍽 Menu
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/menu` | — | Get all menu items. Supports `?category=Coffee` and `?search=latte` |
| `GET` | `/api/menu/:id` | — | Get single menu item by ID |
| `POST` | `/api/menu` | ✅ | Create new menu item |
| `PUT` | `/api/menu/:id` | ✅ | Update menu item |
| `DELETE` | `/api/menu/:id` | ✅ | Delete menu item |

### 🛒 Orders
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/orders` | — | Place a new order (from checkout modal) |
| `GET` | `/api/orders` | ✅ | Get all orders (sorted newest first) |
| `PUT` | `/api/orders/:id/status` | ✅ | Update order status |
| `DELETE` | `/api/orders/:id` | ✅ | Delete an order |

**Order Status Flow:** `pending → preparing → ready → completed` or `cancelled`

### 📅 Reservations
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/reservations` | — | Create a table reservation |
| `GET` | `/api/reservations` | ✅ | Get all reservations |
| `PUT` | `/api/reservations/:id/status` | ✅ | Update reservation status |
| `DELETE` | `/api/reservations/:id` | ✅ | Delete a reservation |
| `GET` | `/api/reservations/export/csv` | ✅ | Download all reservations as CSV file |

**Reservation Status Flow:** `pending → confirmed → completed` or `cancelled`

### ⭐ Reviews
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/reviews` | — | Get all approved reviews |
| `POST` | `/api/reviews` | — | Submit a new review (name, rating, message) |
| `DELETE` | `/api/reviews/:id` | ✅ | Delete a review |

### ✉ Contact & Newsletter
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/contact` | — | Submit contact form message |
| `GET` | `/api/contact` | ✅ | Get all contact messages |
| `PUT` | `/api/contact/:id/read` | ✅ | Mark a message as read |
| `DELETE` | `/api/contact/:id` | ✅ | Delete a message |
| `POST` | `/api/contact/subscribe` | — | Newsletter email subscription |

### 📊 Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/analytics/summary` | ✅ | KPI totals — orders, reservations, customers, revenue |
| `GET` | `/api/analytics/monthly-orders` | ✅ | Last 6 months orders + revenue per month |
| `GET` | `/api/analytics/reservation-trends` | ✅ | Last 6 months reservation + guest counts |

### 🩺 Health Check
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `GET` | `/api/health` | — | Returns `{"status":"ok"}` — confirms server is running |

---

## 📦 Menu Categories

32 items across 6 categories, all with real images from Unsplash:

| Category | Count | Price Range | Emoji |
|----------|:-----:|-------------|:-----:|
| Coffee | 6 | ₹220 – ₹270 | ☕ |
| Tea | 5 | ₹190 – ₹215 | 🍵 |
| Snacks | 5 | ₹280 – ₹420 | 🥜 |
| Desserts | 5 | ₹260 – ₹320 | 🍰 |
| Main Course | 6 | ₹380 – ₹580 | 🍽️ |
| Beverages | 5 | ₹160 – ₹240 | 🥤 |

### Sample Items

**☕ Coffee** — Signature Gold Espresso, Velvet Cappuccino, Hazelnut Praline Latte, Cold Brew Reserve, Dark Mocha Royale, Iced Caramel Cloud

**🍵 Tea** — Imperial Earl Grey, Jasmine Pearl Green Tea, Golden Turmeric Chai, Iced Hibiscus Bloom, Kashmiri Kahwa

**🥜 Snacks** — Truffle Parmesan Fries, Smoked Salmon Bruschetta, Mediterranean Mezze Board, Spiced Paneer Tikka Skewers, Loaded Nachos Platter

**🍰 Desserts** — Dark Chocolate Gold Tart, Classic Tiramisu, Caramel Crème Brûlée, Pistachio Rose Cake, New York Cheesecake

**🍽️ Main Course** — Truffle Mushroom Risotto, Brew Haven Signature Burger, Wood-Fired Margherita Pizza, Grilled Herb Chicken Pasta, Pan-Seared Salmon Fillet, Garden Harvest Buddha Bowl

**🥤 Beverages** — Fresh Citrus Lemonade, Mango Alphonso Smoothie, Virgin Blue Lagoon Mocktail, Tropical Fruit Fusion Juice, Classic Belgian Milkshake

---

## 🎨 Design System

The entire UI is built around a consistent luxury design language:

```css
/* Core Colour Palette */
--gold:        #C9A84C   /* Primary gold — buttons, headings, accents */
--gold-light:  #F5D78E   /* Soft gold — hover states, labels */
--gold-deep:   #9A7B2F   /* Deep gold — borders, secondary text */
--black:       #0A0A0A   /* Page background */
--black-card:  #161616   /* Card backgrounds */
--white:       #F8F4EF   /* Body text (warm white, not pure white) */
```

**Typography:**
- **Playfair Display** — headings, titles, prices (serif elegance)
- **Cormorant Garamond** — body paragraphs, descriptions (refined serif)
- **Jost** — UI labels, buttons, navigation (clean sans-serif)

**Effects used:**
- Glassmorphism cards (`backdrop-filter: blur` + transparent backgrounds)
- CSS custom properties for consistent theming
- Intersection Observer API for scroll-reveal animations
- `cubic-bezier(0.4, 0, 0.2, 1)` easing on all transitions
- Gold gradient on primary buttons and stat numbers

---

## 🗄 Database Schema

### User
```js
{ name, email (unique), password (bcrypt), role: "admin"|"staff", timestamps }
```

### MenuItem
```js
{ name, description, price, category: enum[6], image, isAvailable, isFeatured, tags[], timestamps }
```

### Reservation
```js
{ name, phone, email, date, time, guests, specialRequest,
  status: "pending"|"confirmed"|"cancelled"|"completed", timestamps }
```

### Order
```js
{ customerName, phone, email,
  items: [{ menuItem(ref), name, price, quantity }],
  totalAmount, orderType: "pickup"|"delivery", address,
  status: "pending"|"preparing"|"ready"|"completed"|"cancelled",
  paymentMethod: "cash"|"card"|"online", timestamps }
```

### Review
```js
{ name, rating (1-5), message, isApproved, timestamps }
```

### ContactMessage
```js
{ name, email, subject, message, isRead, timestamps }
```

### Subscriber
```js
{ email (unique), timestamps }
```

---

## ❓ Troubleshooting

**Menu shows "No items found"**
> The database is empty. Stop the server, run `npm run seed`, then `npm start` again. Or just restart — auto-seed runs on every cold start if the menu collection is empty.

**Admin login returns "Server error during login" (500)**
> This was caused by `JWT_SECRET` being undefined. Fixed in the latest version — the app now has a secure built-in fallback. Just update to the latest `server.js`, `authController.js` and `authMiddleware.js`.

**Admin login returns "Invalid credentials" (401)**
> The admin account doesn't exist yet. Run `npm run seed` to create it, or restart the server (auto-seed will create it).

**Cannot connect to MongoDB**
> Make sure MongoDB is running. On Windows: start the MongoDB service or run `mongod` in a terminal. On Mac: run `brew services start mongodb-community`. Or use a MongoDB Atlas cloud URI.

**Port 5000 already in use**
> Change the port in `.env`: `PORT=3000`, then access the site at `http://localhost:3000`.

**`npm run dev` not working**
> Install nodemon: `npm install -g nodemon`, then try again.

---

## 🔮 Future Enhancements

- [ ] **Email notifications** — order confirmation and reservation emails via Nodemailer/SendGrid
- [ ] **Image uploads** — menu item image upload with Multer + Cloudinary storage
- [ ] **Payment gateway** — Razorpay or Stripe integration for online payments
- [ ] **Real-time updates** — live order status tracking with Socket.io
- [ ] **PWA support** — installable on mobile as a Progressive Web App
- [ ] **Customer accounts** — Google / Apple OAuth login for customers
- [ ] **SMS notifications** — booking confirmations via Twilio
- [ ] **Loyalty points** — reward system for returning customers
- [ ] **Multi-role admin** — separate permissions for owner vs staff
- [ ] **Kitchen display** — separate view for kitchen staff to manage incoming orders
- [ ] **Inventory tracking** — stock levels tied to menu item availability
- [ ] **Promo codes** — discount code system at checkout

---

## 📸 Screenshots

> Add screenshots after running the project locally and paste them here.

| Page | Screenshot |
|------|-----------|
| Hero / Home | `screenshots/home.png` |
| Menu with items | `screenshots/menu.png` |
| Cart + Checkout | `screenshots/cart.png` |
| Reservation form | `screenshots/reservation.png` |
| Gallery + Lightbox | `screenshots/gallery.png` |
| Admin Dashboard | `screenshots/admin-dashboard.png` |
| Admin Menu Management | `screenshots/admin-menu.png` |
| Admin Orders | `screenshots/admin-orders.png` |

---

## 👤 Author

👤 Author

Varshini R

🎓 Master of Computer Applications (MCA)
🏫 St Aloysius College (Deemed to be University)

📧 Email: rvarshini354@gmail.com

🐙 GitHub: [varshinir-tech](https://github.com/varshinir-tech)

💼 LinkedIn: [Varshini R](https://www.linkedin.com/in/varshini-r-566862351)

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify and distribute for personal and commercial purposes.

---

<div align="center">

Built with ☕ and 💛 for **FUTUREINTERNS Task 3**

*Full-Stack Local Business Website — Brew Haven Cafe*

**⭐ Star this repo if it helped you!**

</div>