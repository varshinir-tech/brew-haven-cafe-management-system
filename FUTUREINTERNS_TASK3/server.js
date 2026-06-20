require("dotenv").config();
const fs = require("fs");

// ── Auto-create .env from .env.example if missing (zero-setup startup) ──────
if (!fs.existsSync(__dirname + "/.env") && fs.existsSync(__dirname + "/.env.example")) {
  fs.copyFileSync(__dirname + "/.env.example", __dirname + "/.env");
  console.log("[Setup] .env file created from .env.example — restart not needed.");
  require("dotenv").config({ override: true }); // reload with the new file
}

// ── Hard defaults so the app works even if .env is empty/missing ─────────────
process.env.JWT_SECRET  = process.env.JWT_SECRET  || "brewhaven_secret_jwt_key_2024";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
process.env.MONGO_URI   = process.env.MONGO_URI   || "mongodb://127.0.0.1:27017/brewhaven";
process.env.PORT        = process.env.PORT        || "5000";
process.env.ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@brewhaven.com";
process.env.ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
process.env.ADMIN_NAME     = process.env.ADMIN_NAME     || "Brew Haven Admin";

const path    = require("path");
const express = require("express");
const cors    = require("cors");
const connectDB = require("./config/db");

const authRoutes        = require("./routes/authRoutes");
const menuRoutes        = require("./routes/menuRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const orderRoutes       = require("./routes/orderRoutes");
const reviewRoutes      = require("./routes/reviewRoutes");
const contactRoutes     = require("./routes/contactRoutes");
const analyticsRoutes   = require("./routes/analyticsRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",         authRoutes);
app.use("/api/menu",         menuRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/orders",       orderRoutes);
app.use("/api/reviews",      reviewRoutes);
app.use("/api/contact",      contactRoutes);
app.use("/api/analytics",    analyticsRoutes);

app.get("/api/health", (req, res) =>
  res.json({ status: "ok", message: "Brew Haven Cafe API is running." })
);

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", (req, res) =>
  res.status(404).json({ message: "API route not found." })
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error.", error: err.message });
});

/* ============================================================
   AUTO-SEED — runs once on first startup if DB is empty
   ============================================================ */
const User     = require("./models/User");
const MenuItem = require("./models/MenuItem");
const bcrypt   = require("bcryptjs");

const IMG = {
  espresso:   "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80",
  cappuccino: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",
  latte:      "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&q=80",
  coldbrew:   "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
  mocha:      "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80",
  coffee:     "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  tea:        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  greentea:   "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&q=80",
  chai:       "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80",
  hibiscus:   "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=600&q=80",
  fries:      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  bruschetta: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80",
  snack:      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
  nachos:     "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
  tart:       "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=600&q=80",
  tiramisu:   "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
  brulee:     "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80",
  cake:       "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  dessert:    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
  risotto:    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
  burger:     "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  pizza:      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  pasta:      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
  salad:      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  salmon:     "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80",
  lemonade:   "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600&q=80",
  smoothie:   "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
  mocktail:   "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
  juice:      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
  milkshake:  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
};

const MENU_ITEMS = [
  // ── COFFEE (6) ─────────────────────────────────────────────────────────────
  { name:"Signature Gold Espresso",   category:"Coffee",      price:220, image:IMG.espresso,
    description:"A rich double shot finished with a whisper of 24k edible gold dust — our most iconic pour.",
    isFeatured:true, tags:["bestseller"] },
  { name:"Velvet Cappuccino",         category:"Coffee",      price:240, image:IMG.cappuccino,
    description:"Steamed milk microfoam folded over a bold espresso base, dusted with fine cacao." },
  { name:"Hazelnut Praline Latte",    category:"Coffee",      price:260, image:IMG.latte,
    description:"House-made hazelnut praline syrup blended with a silky double shot and steamed whole milk.", tags:["bestseller"] },
  { name:"Cold Brew Reserve",         category:"Coffee",      price:230, image:IMG.coldbrew,
    description:"Slow-steeped for 18 hours in filtered water, served over hand-cut ice. Smooth, never bitter.", tags:["new"] },
  { name:"Dark Mocha Royale",         category:"Coffee",      price:270, image:IMG.mocha,
    description:"70% Valrhona dark chocolate blended with two espresso shots and velvety steamed milk.", isFeatured:true },
  { name:"Iced Caramel Cloud",        category:"Coffee",      price:250, image:IMG.coffee,
    description:"Cold espresso layered over salted caramel milk and topped with whipped cream cloud.", tags:["new"] },

  // ── TEA (5) ────────────────────────────────────────────────────────────────
  { name:"Imperial Earl Grey",        category:"Tea",         price:190, image:IMG.tea,
    description:"Bergamot-laced black tea sourced from Darjeeling, brewed loose-leaf in copper pots." },
  { name:"Jasmine Pearl Green Tea",   category:"Tea",         price:200, image:IMG.greentea,
    description:"Hand-rolled green tea pearls that bloom open in the cup with a delicate floral aroma." },
  { name:"Golden Turmeric Chai",      category:"Tea",         price:210, image:IMG.chai,
    description:"Spiced masala chai brightened with organic turmeric and finished with raw honey.", isFeatured:true },
  { name:"Iced Hibiscus Bloom",       category:"Tea",         price:195, image:IMG.hibiscus,
    description:"Tart hibiscus petals steeped cold overnight, served over crushed ice with a citrus wedge.", tags:["bestseller"] },
  { name:"Kashmiri Kahwa",            category:"Tea",         price:215, image:IMG.tea,
    description:"Traditional saffron-spiced green tea with crushed almonds and a hint of cardamom.", tags:["new"] },

  // ── SNACKS (5) ─────────────────────────────────────────────────────────────
  { name:"Truffle Parmesan Fries",    category:"Snacks",      price:280, image:IMG.fries,
    description:"Hand-cut double-fried fries finished with white truffle oil and aged Parmigiano Reggiano.", tags:["bestseller"] },
  { name:"Smoked Salmon Bruschetta",  category:"Snacks",      price:350, image:IMG.bruschetta,
    description:"Toasted sourdough with whipped cream cheese, house-cold-smoked salmon and capers." },
  { name:"Mediterranean Mezze Board", category:"Snacks",      price:420, image:IMG.snack,
    description:"Hummus, babaganoush, marinated olives, feta crumble and warm pita for sharing." },
  { name:"Spiced Paneer Tikka Skewers", category:"Snacks",   price:300, image:IMG.snack,
    description:"Cubes of fresh paneer marinated in a smoky tandoori blend, grilled with mint chutney.", isFeatured:true },
  { name:"Loaded Nachos Platter",     category:"Snacks",      price:320, image:IMG.nachos,
    description:"Crispy tortilla chips smothered with jalapeño salsa, sour cream, guacamole and cheddar.", tags:["bestseller"] },

  // ── DESSERTS (5) ───────────────────────────────────────────────────────────
  { name:"Dark Chocolate Gold Tart",  category:"Desserts",    price:320, image:IMG.tart,
    description:"70% dark chocolate ganache set in a buttery tart shell, finished with genuine gold leaf.",
    isFeatured:true, tags:["bestseller"] },
  { name:"Classic Tiramisu",          category:"Desserts",    price:280, image:IMG.tiramisu,
    description:"Espresso-soaked Savoiardi ladyfingers layered with mascarpone cream and cocoa snow." },
  { name:"Caramel Crème Brûlée",      category:"Desserts",    price:260, image:IMG.brulee,
    description:"Silky Madagascan vanilla custard baked slow and finished with a hand-torched caramel crust." },
  { name:"Pistachio Rose Cake",       category:"Desserts",    price:300, image:IMG.cake,
    description:"Moist pistachio sponge layered with rosewater cream and crushed pistachios.", tags:["new"] },
  { name:"New York Cheesecake",       category:"Desserts",    price:290, image:IMG.dessert,
    description:"Dense, creamy baked cheesecake on a Graham cracker base with a fresh berry coulis." },

  // ── MAIN COURSE (6) ────────────────────────────────────────────────────────
  { name:"Truffle Mushroom Risotto",  category:"Main Course", price:520, image:IMG.risotto,
    description:"Arborio rice cooked to a creamy finish with porcini mushrooms, parmesan and black truffle oil.",
    isFeatured:true, tags:["bestseller"] },
  { name:"Brew Haven Signature Burger", category:"Main Course", price:480, image:IMG.burger,
    description:"180g prime beef patty, aged cheddar, caramelised onion jam, brioche bun, twice-cooked fries.", tags:["bestseller"] },
  { name:"Wood-Fired Margherita Pizza", category:"Main Course", price:440, image:IMG.pizza,
    description:"San Marzano tomato base, fresh buffalo mozzarella, hand-torn basil on a 48-hour fermented crust." },
  { name:"Grilled Herb Chicken Pasta", category:"Main Course", price:460, image:IMG.pasta,
    description:"Pappardelle tossed in a roasted garlic cream sauce with herb-marinated grilled chicken breast." },
  { name:"Pan-Seared Salmon Fillet",  category:"Main Course", price:580, image:IMG.salmon,
    description:"Norwegian salmon fillet seared to a golden crust, with lemon butter sauce and seasonal vegetables.", tags:["new"] },
  { name:"Garden Harvest Buddha Bowl", category:"Main Course", price:380, image:IMG.salad,
    description:"Quinoa, roasted chickpeas, avocado, pickled red cabbage, carrot ribbons and tahini dressing.", tags:["vegan"] },

  // ── BEVERAGES (5) ──────────────────────────────────────────────────────────
  { name:"Fresh Citrus Lemonade",     category:"Beverages",   price:160, image:IMG.lemonade,
    description:"Hand-squeezed lemons shaken with raw cane sugar and still or sparkling water.", isFeatured:true },
  { name:"Mango Alphonso Smoothie",   category:"Beverages",   price:200, image:IMG.smoothie,
    description:"Alphonso mangoes blended with Greek yogurt, raw honey and a pinch of cardamom.", tags:["bestseller"] },
  { name:"Virgin Blue Lagoon Mocktail", category:"Beverages", price:220, image:IMG.mocktail,
    description:"Blue curaçao syrup, coconut water, lime juice and soda — a gorgeous non-alcoholic cooler.", tags:["new"] },
  { name:"Tropical Fruit Fusion Juice", category:"Beverages", price:180, image:IMG.juice,
    description:"Cold-pressed pineapple, watermelon, ginger and mint — served in a chilled mason jar." },
  { name:"Classic Belgian Milkshake", category:"Beverages",   price:240, image:IMG.milkshake,
    description:"Premium vanilla ice cream blended thick with whole milk — vanilla, chocolate, or strawberry.", tags:["bestseller"] },
];

const ADMIN = {
  name:     process.env.ADMIN_NAME     || "Brew Haven Admin",
  email:    (process.env.ADMIN_EMAIL   || "admin@brewhaven.com").toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "admin123",
  role:     "admin",
};

async function autoSeed() {
  try {
    // ── Admin user ─────────────────────────────────────────────────────────
    const existingAdmin = await User.findOne({ email: ADMIN.email });
    if (!existingAdmin) {
      await User.create(ADMIN);
      console.log(`[AutoSeed] ✅ Admin created → ${ADMIN.email} / ${ADMIN.password}`);
    } else {
      // Always ensure password is correct (in case .env changed)
      const ok = await existingAdmin.comparePassword(ADMIN.password);
      if (!ok) {
        existingAdmin.password = ADMIN.password;
        await existingAdmin.save();
        console.log(`[AutoSeed] 🔑 Admin password reset → ${ADMIN.email} / ${ADMIN.password}`);
      } else {
        console.log(`[AutoSeed] ✅ Admin account OK → ${ADMIN.email}`);
      }
    }

    // ── Menu items ─────────────────────────────────────────────────────────
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      await MenuItem.insertMany(MENU_ITEMS);
      console.log(`[AutoSeed] ✅ Inserted ${MENU_ITEMS.length} menu items across 6 categories`);
    } else {
      console.log(`[AutoSeed] ✅ Menu OK — ${menuCount} items already in database`);
    }

    console.log(`\n  ╔══════════════════════════════════════════════╗`);
    console.log(`  ║        BREW HAVEN CAFE — Ready! ☕            ║`);
    console.log(`  ╠══════════════════════════════════════════════╣`);
    console.log(`  ║  Site:     http://localhost:${process.env.PORT || 5000}              ║`);
    console.log(`  ║  Admin:    http://localhost:${process.env.PORT || 5000}/admin/       ║`);
    console.log(`  ║  Email:    ${ADMIN.email.padEnd(34)}║`);
    console.log(`  ║  Password: ${ADMIN.password.padEnd(34)}║`);
    console.log(`  ╚══════════════════════════════════════════════╝\n`);
  } catch (err) {
    console.error("[AutoSeed] ❌ Failed:", err.message);
  }
}

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await autoSeed();                          // ← seeds DB on every cold start
  app.listen(PORT, () => {
    console.log(`☕  Server listening on http://localhost:${PORT}`);
  });
});
