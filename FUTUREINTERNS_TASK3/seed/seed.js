// Run with: npm run seed
// Re-running is safe — it REPLACES the admin password and REPLACES all menu items.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");

// ─── ADMIN CREDENTIALS ───────────────────────────────────────────────────────
const ADMIN = {
  name:     process.env.ADMIN_NAME     || "Brew Haven Admin",
  email:    (process.env.ADMIN_EMAIL   || "admin@brewhaven.com").toLowerCase(),
  password: process.env.ADMIN_PASSWORD || "admin123",
  role:     "admin",
};

// ─── IMAGE HELPERS ────────────────────────────────────────────────────────────
// Using Unsplash Source URLs — no API key needed, always returns an image.
const IMG = {
  coffee:     "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80",
  espresso:   "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80",
  cappuccino: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80",
  latte:      "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&q=80",
  coldbrew:   "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
  mocha:      "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&q=80",
  tea:        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
  greentea:   "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600&q=80",
  chai:       "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&q=80",
  hibiscus:   "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?w=600&q=80",
  snack:      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
  fries:      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80",
  bruschetta: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80",
  sandwich:   "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80",
  nachos:     "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&q=80",
  dessert:    "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
  tart:       "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=600&q=80",
  tiramisu:   "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80",
  brulee:     "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80",
  cake:       "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&q=80",
  pasta:      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
  burger:     "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
  pizza:      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
  risotto:    "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
  salad:      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  steak:      "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80",
  juice:      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
  smoothie:   "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&q=80",
  mocktail:   "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
  lemonade:   "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?w=600&q=80",
  milkshake:  "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80",
};

// ─── MENU DATA (32 items across 6 categories) ─────────────────────────────────
const sampleMenu = [

  // ── COFFEE (6 items) ──────────────────────────────────────────────────────
  {
    name: "Signature Gold Espresso",
    category: "Coffee", price: 220,
    description: "A rich double shot finished with a whisper of 24k edible gold dust — our most iconic pour.",
    image: IMG.espresso,
    isFeatured: true, tags: ["bestseller"],
  },
  {
    name: "Velvet Cappuccino",
    category: "Coffee", price: 240,
    description: "Steamed milk microfoam folded over a bold espresso base, dusted with fine cacao.",
    image: IMG.cappuccino,
  },
  {
    name: "Hazelnut Praline Latte",
    category: "Coffee", price: 260,
    description: "House-made hazelnut praline syrup blended with a silky double shot and steamed whole milk.",
    image: IMG.latte,
    tags: ["bestseller"],
  },
  {
    name: "Cold Brew Reserve",
    category: "Coffee", price: 230,
    description: "Slow-steeped for 18 hours in filtered water, served over hand-cut ice. Smooth, never bitter.",
    image: IMG.coldbrew,
    tags: ["new"],
  },
  {
    name: "Dark Mocha Royale",
    category: "Coffee", price: 270,
    description: "70% Valrhona dark chocolate blended with two espresso shots and velvety steamed milk.",
    image: IMG.mocha,
    isFeatured: true,
  },
  {
    name: "Iced Caramel Cloud",
    category: "Coffee", price: 250,
    description: "Cold espresso layered over salted caramel milk and topped with whipped cream cloud.",
    image: IMG.coffee,
    tags: ["new"],
  },

  // ── TEA (5 items) ─────────────────────────────────────────────────────────
  {
    name: "Imperial Earl Grey",
    category: "Tea", price: 190,
    description: "Bergamot-laced black tea sourced from Darjeeling, brewed loose-leaf in copper pots.",
    image: IMG.tea,
  },
  {
    name: "Jasmine Pearl Green Tea",
    category: "Tea", price: 200,
    description: "Hand-rolled green tea pearls that bloom open in the cup with a delicate floral aroma.",
    image: IMG.greentea,
  },
  {
    name: "Golden Turmeric Chai",
    category: "Tea", price: 210,
    description: "Spiced masala chai brightened with organic turmeric and finished with raw honey.",
    image: IMG.chai,
    isFeatured: true,
  },
  {
    name: "Iced Hibiscus Bloom",
    category: "Tea", price: 195,
    description: "Tart hibiscus petals steeped cold overnight, served over crushed ice with a citrus wedge.",
    image: IMG.hibiscus,
    tags: ["bestseller"],
  },
  {
    name: "Kashmiri Kahwa",
    category: "Tea", price: 215,
    description: "Traditional saffron-spiced green tea with crushed almonds and a hint of cardamom.",
    image: IMG.tea,
    tags: ["new"],
  },

  // ── SNACKS (5 items) ──────────────────────────────────────────────────────
  {
    name: "Truffle Parmesan Fries",
    category: "Snacks", price: 280,
    description: "Hand-cut double-fried fries finished with white truffle oil and aged Parmigiano Reggiano.",
    image: IMG.fries,
    tags: ["bestseller"],
  },
  {
    name: "Smoked Salmon Bruschetta",
    category: "Snacks", price: 350,
    description: "Toasted sourdough with whipped cream cheese, house-cold-smoked salmon and capers.",
    image: IMG.bruschetta,
  },
  {
    name: "Mediterranean Mezze Board",
    category: "Snacks", price: 420,
    description: "Hummus, babaganoush, marinated olives, feta crumble and warm pita for sharing.",
    image: IMG.snack,
  },
  {
    name: "Spiced Paneer Tikka Skewers",
    category: "Snacks", price: 300,
    description: "Cubes of fresh paneer marinated in a smoky tandoori blend, grilled and served with mint chutney.",
    image: IMG.snack,
    isFeatured: true,
  },
  {
    name: "Loaded Nachos Platter",
    category: "Snacks", price: 320,
    description: "Crispy tortilla chips smothered with jalapeño salsa, sour cream, guacamole and cheddar.",
    image: IMG.nachos,
    tags: ["bestseller"],
  },

  // ── DESSERTS (5 items) ────────────────────────────────────────────────────
  {
    name: "Dark Chocolate Gold Tart",
    category: "Desserts", price: 320,
    description: "70% dark chocolate ganache set in a buttery tart shell, finished with genuine gold leaf.",
    image: IMG.tart,
    isFeatured: true, tags: ["bestseller"],
  },
  {
    name: "Classic Tiramisu",
    category: "Desserts", price: 280,
    description: "Espresso-soaked Savoiardi ladyfingers layered with mascarpone cream and cocoa snow.",
    image: IMG.tiramisu,
  },
  {
    name: "Caramel Crème Brûlée",
    category: "Desserts", price: 260,
    description: "Silky Madagascan vanilla custard baked slow and finished with a hand-torched caramel crust.",
    image: IMG.brulee,
  },
  {
    name: "Pistachio Rose Cake",
    category: "Desserts", price: 300,
    description: "Moist pistachio sponge layered with rosewater cream and crushed pistachios.",
    image: IMG.cake,
    tags: ["new"],
  },
  {
    name: "New York Cheesecake",
    category: "Desserts", price: 290,
    description: "Dense, creamy baked cheesecake on a Graham cracker base with a fresh berry coulis.",
    image: IMG.dessert,
  },

  // ── MAIN COURSE (6 items) ─────────────────────────────────────────────────
  {
    name: "Truffle Mushroom Risotto",
    category: "Main Course", price: 520,
    description: "Arborio rice cooked to a creamy finish with porcini mushrooms, parmesan and black truffle oil.",
    image: IMG.risotto,
    isFeatured: true, tags: ["bestseller"],
  },
  {
    name: "Brew Haven Signature Burger",
    category: "Main Course", price: 480,
    description: "180g prime beef patty, aged cheddar, caramelised onion jam, brioche bun, twice-cooked fries.",
    image: IMG.burger,
    tags: ["bestseller"],
  },
  {
    name: "Wood-Fired Margherita Pizza",
    category: "Main Course", price: 440,
    description: "San Marzano tomato base, fresh buffalo mozzarella, hand-torn basil on a 48-hour fermented crust.",
    image: IMG.pizza,
  },
  {
    name: "Grilled Herb Chicken Pasta",
    category: "Main Course", price: 460,
    description: "Pappardelle tossed in a roasted garlic cream sauce with herb-marinated grilled chicken breast.",
    image: IMG.pasta,
  },
  {
    name: "Pan-Seared Salmon Fillet",
    category: "Main Course", price: 580,
    description: "Norwegian salmon fillet seared to a golden crust, served with lemon butter sauce and seasonal vegetables.",
    image: IMG.steak,
    tags: ["new"],
  },
  {
    name: "Garden Harvest Buddha Bowl",
    category: "Main Course", price: 380,
    description: "Quinoa, roasted chickpeas, avocado, pickled red cabbage, carrot ribbons and tahini dressing.",
    image: IMG.salad,
    tags: ["vegan"],
  },

  // ── BEVERAGES (5 items) ───────────────────────────────────────────────────
  {
    name: "Fresh Citrus Lemonade",
    category: "Beverages", price: 160,
    description: "Hand-squeezed lemons shaken with raw cane sugar and still or sparkling water.",
    image: IMG.lemonade,
    isFeatured: true,
  },
  {
    name: "Mango Alphonso Smoothie",
    category: "Beverages", price: 200,
    description: "Alphonso mangoes blended with Greek yogurt, raw honey and a pinch of cardamom.",
    image: IMG.smoothie,
    tags: ["bestseller"],
  },
  {
    name: "Virgin Blue Lagoon Mocktail",
    category: "Beverages", price: 220,
    description: "Blue curaçao syrup, coconut water, lime juice and soda — a gorgeous non-alcoholic cooler.",
    image: IMG.mocktail,
    tags: ["new"],
  },
  {
    name: "Tropical Fruit Fusion Juice",
    category: "Beverages", price: 180,
    description: "Cold-pressed pineapple, watermelon, ginger and mint — served in a chilled mason jar.",
    image: IMG.juice,
  },
  {
    name: "Classic Belgian Milkshake",
    category: "Beverages", price: 240,
    description: "Premium vanilla ice cream blended thick with whole milk, your choice: vanilla, chocolate, or strawberry.",
    image: IMG.milkshake,
    tags: ["bestseller"],
  },
];

// ─── RUNNER ───────────────────────────────────────────────────────────────────
const run = async () => {
  await connectDB();

  // ── 1. ADMIN USER (force-reset password so re-running fixes wrong credentials)
  const existing = await User.findOne({ email: ADMIN.email });
  if (existing) {
    existing.password = ADMIN.password; // pre-save hook will hash it
    await existing.save();
    console.log(`[Seed] Admin password reset  -> ${ADMIN.email} / ${ADMIN.password}`);
  } else {
    await User.create(ADMIN);
    console.log(`[Seed] Admin user created    -> ${ADMIN.email} / ${ADMIN.password}`);
  }

  // ── 2. MENU ITEMS (full replace — drop and re-insert so changes always apply)
  await MenuItem.deleteMany({});
  const inserted = await MenuItem.insertMany(sampleMenu);
  console.log(`[Seed] Menu items inserted   -> ${inserted.length} items across 6 categories`);

  console.log("\n╔══════════════════════════════════════════════════════╗");
  console.log("║         BREW HAVEN CAFE — Seed Complete              ║");
  console.log("╠══════════════════════════════════════════════════════╣");
  console.log(`║  Admin URL:      http://localhost:5000/admin/         ║`);
  console.log(`║  Admin Email:    ${ADMIN.email.padEnd(36)}║`);
  console.log(`║  Admin Password: ${ADMIN.password.padEnd(36)}║`);
  console.log(`║  Menu items:     ${String(inserted.length).padEnd(36)}║`);
  console.log("╚══════════════════════════════════════════════════════╝\n");

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("[Seed] Failed:", err.message);
  process.exit(1);
});
