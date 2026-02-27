import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import QRCode from "qrcode";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("vizag_artisans_v9.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('customer', 'artisan')) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS artisan_profiles (
    user_id INTEGER PRIMARY KEY,
    bio TEXT,
    short_description TEXT,
    location TEXT,
    category TEXT,
    sustainability_score INTEGER DEFAULT 90,
    photo_url TEXT,
    video_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    artisan_id INTEGER,
    image_url TEXT,
    raw_material_source TEXT,
    time_to_create TEXT,
    sustainability_score INTEGER,
    FOREIGN KEY(artisan_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed some data if empty
const userCount = db.prepare("SELECT count(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPass = bcrypt.hashSync("password123", salt);
  
  // Artisan 1: Ravi Kumar (Etikoppaka)
  const artisanId1 = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Ravi Kumar", "ravi@artisan.com", hashedPass, "artisan"
  ).lastInsertRowid;

  db.prepare("INSERT INTO artisan_profiles (user_id, bio, short_description, location, category, sustainability_score, photo_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
    artisanId1, 
    "Master artisan from Etikoppaka with 20 years of experience. Ravi specializes in the ancient art of lacquerware, using natural dyes derived from seeds, bark, and roots to create safe and beautiful toys.",
    "Preserving the 400-year-old lacquerware tradition of Etikoppaka with 100% natural dyes.",
    "Etikoppaka, Visakhapatnam",
    "Etikoppaka Toys",
    98,
    "https://images.unsplash.com/photo-1566753323558-f4e0952af115?q=80&w=400&auto=format&fit=crop",
    "https://www.youtube.com/embed/f-XWvC1uLpE"
  );

  db.prepare("INSERT INTO products (name, description, price, category, artisan_id, image_url, raw_material_source, time_to_create, sustainability_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "Etikoppaka Wooden Elephant",
    "Hand-painted traditional wooden elephant using natural dyes. A symbol of strength and wisdom, crafted using the 400-year-old lacquerware technique.",
    1200,
    "Etikoppaka Toys",
    artisanId1,
    "https://images.unsplash.com/photo-1581337204873-ef36aa186caa?q=80&w=800&auto=format&fit=crop",
    "Ankudu Wood (Wrightia tinctoria)",
    "4 days",
    98
  );

  db.prepare("INSERT INTO products (name, description, price, category, artisan_id, image_url, raw_material_source, time_to_create, sustainability_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "Traditional Lattu (Spinning Top)",
    "Classic spinning top, a favorite childhood toy made with sustainable wood and vibrant natural colors. Perfectly balanced for long spins.",
    450,
    "Etikoppaka Toys",
    artisanId1,
    "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=800&auto=format&fit=crop",
    "Ankudu Wood",
    "2 days",
    99
  );

  // Artisan 2: Lakshmi Devi (Kalamkari)
  const artisanId2 = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Lakshmi Devi", "lakshmi@artisan.com", hashedPass, "artisan"
  ).lastInsertRowid;

  db.prepare("INSERT INTO artisan_profiles (user_id, bio, short_description, location, category, sustainability_score, photo_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
    artisanId2, 
    "Lakshmi is a third-generation Kalamkari artist. Her intricate designs tell stories from Indian mythology and local folklore, using only natural vegetable dyes on hand-woven cotton.",
    "Creating intricate hand-painted stories on fabric using ancient vegetable dye techniques.",
    "Visakhapatnam City",
    "Kalamkari",
    96,
    "https://images.unsplash.com/photo-1566733971017-f6a46e832e95?q=80&w=400&auto=format&fit=crop",
    "https://www.youtube.com/embed/Xm_P_i-5Xy4"
  );

  db.prepare("INSERT INTO products (name, description, price, category, artisan_id, image_url, raw_material_source, time_to_create, sustainability_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "Hand-painted Kalamkari Saree",
    "Exquisite cotton saree featuring hand-painted floral motifs using vegetable dyes. Each piece takes weeks to complete, involving 23 rigorous steps of washing and painting.",
    4500,
    "Handloom Sarees",
    artisanId2,
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
    "Organic Cotton & Natural Dyes",
    "15 days",
    94
  );

  db.prepare("INSERT INTO products (name, description, price, category, artisan_id, image_url, raw_material_source, time_to_create, sustainability_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "Kalamkari Wall Hanging",
    "A stunning piece of art for your home, depicting the 'Tree of Life' in traditional Srikalahasti style. Hand-painted with a bamboo pen (kalam).",
    2800,
    "Kalamkari",
    artisanId2,
    "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop",
    "Hand-woven Cotton",
    "7 days",
    96
  );

  // Artisan 3: Srinivas Rao (Bamboo)
  const artisanId3 = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
    "Srinivas Rao", "srinivas@artisan.com", hashedPass, "artisan"
  ).lastInsertRowid;

  db.prepare("INSERT INTO artisan_profiles (user_id, bio, short_description, location, category, sustainability_score, photo_url, video_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
    artisanId3, 
    "Srinivas works with tribal communities in the Araku Valley to bring their unique bamboo art forms to a wider audience. He focuses on modern utility items made with traditional weaving techniques.",
    "Empowering Araku tribal communities through sustainable bamboo craftsmanship and modern design.",
    "Araku Valley, Visakhapatnam",
    "Tribal Art",
    100,
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
    "https://www.youtube.com/embed/5U_O89p6X3A"
  );

  db.prepare("INSERT INTO products (name, description, price, category, artisan_id, image_url, raw_material_source, time_to_create, sustainability_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "Tribal Bamboo Lamp",
    "Hand-crafted lamp made from locally sourced bamboo, reflecting the simple elegance of tribal life in Araku. Provides a warm, diffused glow.",
    1500,
    "Tribal Art",
    artisanId3,
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
    "Wild Bamboo from Araku",
    "3 days",
    100
  );
}

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "vizag-secret-key";

// Auth Routes
app.post("/api/auth/signup", (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const result = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, hashedPassword, role);
    
    if (role === 'artisan') {
      db.prepare("INSERT INTO artisan_profiles (user_id) VALUES (?)").run(result.lastInsertRowid);
    }

    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Product Routes
app.get("/api/products", (req, res) => {
  const products = db.prepare(`
    SELECT 
      p.id, p.name, p.description, p.price, p.category, p.artisan_id, 
      p.image_url as image, p.raw_material_source as rawMaterialSource, 
      p.time_to_create as timeToCreate, p.sustainability_score as sustainabilityScore,
      u.name as artisanName 
    FROM products p 
    JOIN users u ON p.artisan_id = u.id
  `).all();
  res.json(products);
});

app.get("/api/products/:id", async (req, res) => {
  const product = db.prepare(`
    SELECT 
      p.id, p.name, p.description, p.price, p.category, p.artisan_id, 
      p.image_url as image, p.raw_material_source as rawMaterialSource, 
      p.time_to_create as timeToCreate, p.sustainability_score as sustainabilityScore,
      u.name as artisanName, 
      ap.location, 
      ap.video_url as videoUrl, 
      ap.bio as artisanBio
    FROM products p 
    JOIN users u ON p.artisan_id = u.id
    JOIN artisan_profiles ap ON u.id = ap.user_id
    WHERE p.id = ?
  `).get(req.params.id) as any;

  if (product) {
    // Robust QR data: use APP_URL or fallback to relative path
    const baseUrl = process.env.APP_URL || "";
    const qrData = baseUrl ? `${baseUrl}/product/${product.id}` : `/product/${product.id}`;
    const qrCode = await QRCode.toDataURL(qrData);
    res.json({ ...product, qrCode });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Order Routes
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
};

app.post("/api/orders", authenticate, (req: any, res) => {
  const { productId } = req.body;
  try {
    db.prepare("INSERT INTO orders (customer_id, product_id) VALUES (?, ?)").run(req.user.id, productId);
    res.status(201).json({ message: "Order placed successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.get("/api/orders", authenticate, (req: any, res) => {
  const orders = db.prepare(`
    SELECT o.*, p.name as product_name, p.price, p.image_url
    FROM orders o
    JOIN products p ON o.product_id = p.id
    WHERE o.customer_id = ?
    ORDER BY o.created_at DESC
  `).all(req.user.id);
  res.json(orders);
});

// Artisan Routes
app.get("/api/artisans", (req, res) => {
  const artisans = db.prepare(`
    SELECT 
      u.id, 
      u.name, 
      ap.location, 
      ap.photo_url as image, 
      ap.video_url as videoUrl,
      ap.category, 
      ap.sustainability_score as sustainabilityScore, 
      ap.short_description as shortDescription
    FROM users u
    JOIN artisan_profiles ap ON u.id = ap.user_id
    WHERE u.role = 'artisan'
  `).all();
  res.json(artisans);
});

app.get("/api/artisans/:id", (req, res) => {
  const artisan = db.prepare(`
    SELECT 
      u.id,
      u.name, 
      ap.bio,
      ap.short_description as shortDescription,
      ap.location,
      ap.category,
      ap.sustainability_score as sustainabilityScore,
      ap.photo_url as image,
      ap.video_url as videoUrl
    FROM users u 
    JOIN artisan_profiles ap ON u.id = ap.user_id 
    WHERE u.id = ? AND u.role = 'artisan'
  `).get(req.params.id) as any;
  
  if (!artisan) {
    return res.status(404).json({ error: "Artisan not found" });
  }
  
  const products = db.prepare("SELECT * FROM products WHERE artisan_id = ?").all(req.params.id);
  
  res.json({ artisan, products });
});

// Dashboard Routes (Protected)
app.get("/api/artisan/stats", authenticate, (req: any, res) => {
  if (req.user.role !== 'artisan') return res.status(403).json({ error: "Forbidden" });
  
  const totalOrders = db.prepare("SELECT count(*) as count FROM orders o JOIN products p ON o.product_id = p.id WHERE p.artisan_id = ?").get(req.user.id) as any;
  const totalEarnings = db.prepare("SELECT sum(p.price * 0.7) as earnings FROM orders o JOIN products p ON o.product_id = p.id WHERE p.artisan_id = ?").get(req.user.id) as any;
  
  res.json({
    totalOrders: totalOrders.count,
    totalEarnings: totalEarnings.earnings || 0,
    monthlySales: [
      { name: 'Jan', sales: 400 },
      { name: 'Feb', sales: 300 },
      { name: 'Mar', sales: 600 },
      { name: 'Apr', sales: 800 },
    ]
  });
});

app.post("/api/products", authenticate, (req: any, res) => {
  if (req.user.role !== 'artisan') return res.status(403).json({ error: "Forbidden" });
  const { name, description, price, category, image_url, raw_material_source, time_to_create } = req.body;
  
  const sustainability_score = Math.floor(Math.random() * 20) + 80; // Mock score

  db.prepare(`
    INSERT INTO products (name, description, price, category, artisan_id, image_url, raw_material_source, time_to_create, sustainability_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, description, price, category, req.user.id, image_url, raw_material_source, time_to_create, sustainability_score);
  
  res.status(201).json({ message: "Product added" });
});

// Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(3000, "0.0.0.0", () => {
    console.log("Server running on http://0.0.0.0:3000");
  });
}

startServer();
