/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { DatabaseSim } from "./src/dbSim";
import { CategoryType, ResellerLevel } from "./src/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Initialize Database Simulation
  const db = new DatabaseSim();

  // Initialize Google GenAI if key is present
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini API initialized successfully!");
    } catch (err) {
      console.error("Failed to initialize Gemini API Client:", err);
    }
  } else {
    console.warn("GEMINI_API_KEY not configured or set to placeholder. Gemini assistance will fall back to smart rule-based mock responses.");
  }

  // ==========================================
  // --- API ENDPOINTS ---
  // ==========================================

  // 1. Health & Business Contact Information
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      projectName: "WZ TEXTILE BY AHM ONLINE GROUP",
      owner: "H. Aang Kurnia",
      csPhone: "085320200882",
      email: "wztextile51@gmail.com",
      address: "Jl. Bandung - Rancabuaya - Caringin Garut",
      timestamp: new Date().toISOString()
    });
  });

  // 2. Authentication / Profiles
  app.get("/api/auth/profiles", (req: Request, res: Response) => {
    res.json(db.users);
  });

  app.put("/api/auth/profile/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { balance, points } = req.body;
    const user = db.users.find(u => u.id === id);
    if (user) {
      if (balance !== undefined) user.balance = balance;
      if (points !== undefined) user.points = points;
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });

  // 3. Products Endpoints
  app.get("/api/products", (req: Request, res: Response) => {
    const filters = req.query;
    const products = db.getProducts(filters);
    res.json(products);
  });

  app.get("/api/products/:id", (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/products", (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const product = db.createProduct(productData);
      res.status(210).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index !== -1) {
      const p = db.products[index];
      db.products.splice(index, 1);
      db.addAuditLog("Yusuf Reseller", "Seller", `Delete Product ${p.name} (SKU: ${p.sku}) Success`);
      res.json({ success: true, message: "Product deleted" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // 4. Reseller / Store Registration & Verification
  app.get("/api/stores", (req: Request, res: Response) => {
    res.json(db.stores);
  });

  app.get("/api/stores/owner/:ownerId", (req: Request, res: Response) => {
    const store = db.getStoreByOwner(req.params.ownerId);
    if (store) {
      res.json(store);
    } else {
      res.json(null); // Return null so frontend can show "Apply Reseller" button
    }
  });

  app.post("/api/reseller/apply", (req: Request, res: Response) => {
    try {
      const storeData = req.body;
      const newStore = db.createStore(storeData);
      res.json(newStore);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/reseller/approve/:storeId", (req: Request, res: Response) => {
    const success = db.approveStore(req.params.storeId);
    if (success) {
      res.json({ success: true, message: "Store approved & verified successfully" });
    } else {
      res.status(404).json({ error: "Store not found" });
    }
  });

  app.put("/api/reseller/store/:id", (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, logo, banner, address, openHours, level, balance } = req.body;
    const store = db.stores.find(s => s.id === id);
    if (store) {
      if (name) store.name = name;
      if (logo) store.logo = logo;
      if (banner) store.banner = banner;
      if (address) store.address = address;
      if (openHours) store.openHours = openHours;
      if (level) store.level = level;
      if (balance !== undefined) store.balance = balance;
      res.json(store);
    } else {
      res.status(404).json({ error: "Store not found" });
    }
  });

  // 5. Orders Management
  app.get("/api/orders", (req: Request, res: Response) => {
    const { userId, role } = req.query;
    if (!userId || !role) {
      return res.status(400).json({ error: "Missing userId or role" });
    }
    const orders = db.getOrders(userId as string, role as "Buyer" | "Seller" | "Admin");
    res.json(orders);
  });

  app.post("/api/orders", (req: Request, res: Response) => {
    try {
      const order = db.createOrder(req.body);
      res.json(order);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/api/orders/:id/status", (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, trackingLog } = req.body;
    const order = db.orders.find(o => o.id === id);
    if (order) {
      order.status = status;
      if (trackingLog) {
        order.trackingLogs.push(`${trackingLog} - ${new Date().toISOString()}`);
      }
      db.addAuditLog("System", "Service", `Order ${id} Status Updated to ${status}`);
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  });

  // 6. Chat Endpoints
  app.get("/api/chat/rooms", (req: Request, res: Response) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });
    res.json(db.getChatRooms(userId as string));
  });

  app.post("/api/chat/rooms", (req: Request, res: Response) => {
    const { buyerId, buyerName, sellerId, sellerName } = req.body;
    if (!buyerId || !sellerId) return res.status(400).json({ error: "Missing buyerId or sellerId" });
    const room = db.createChatRoom(buyerId, buyerName, sellerId, sellerName);
    res.json(room);
  });

  app.get("/api/chat/rooms/:roomId/messages", (req: Request, res: Response) => {
    res.json(db.getMessages(req.params.roomId));
  });

  app.post("/api/chat/rooms/:roomId/messages", (req: Request, res: Response) => {
    const { roomId } = req.params;
    const { senderId, senderName, content, type, fileUrl, duration } = req.body;
    const message = db.sendMessage(roomId, senderId, senderName, content, type, fileUrl, duration);
    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ error: "Chat room not found" });
    }
  });

  // 7. Security Logs (RBAC compliance)
  app.get("/api/audit-logs", (req: Request, res: Response) => {
    res.json(db.auditLogs);
  });

  // 8. Blog & FAQ CMS
  app.get("/api/cms/faqs", (req: Request, res: Response) => {
    res.json(db.faqs);
  });

  app.get("/api/cms/articles", (req: Request, res: Response) => {
    res.json(db.articles);
  });

  app.get("/api/cms/banners", (req: Request, res: Response) => {
    res.json(db.banners);
  });

  // 9. AI Assistant (Gemini Integration)
  app.post("/api/gemini/assist", async (req: Request, res: Response) => {
    const { prompt, type } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (ai) {
      try {
        let systemInstruction = "You are WZ Textile Assistant, a highly intelligent virtual consultant for WZ TEXTILE BY AHM ONLINE GROUP. Your mission is to help users, resellers, and admins with product creation, SEO descriptions, chat assistance, or eco-friendly recycling/barter advice. Keep responses friendly, objective, helpful, and in Bahasa Indonesia.";
        
        if (type === "seo-desc") {
          systemInstruction = "You are an SEO Copywriting Expert. Create highly persuasive, structured, search-engine-optimized descriptions for e-commerce products in Bahasa Indonesia. Highlight product quality, specs, benefit and add trust factors (Garansi, Pelayanan owner H. Aang Kurnia, fast response). Keep the output clean, using professional bullet points and paragraphs.";
        } else if (type === "barter") {
          systemInstruction = "You are an Eco-Friendly Circular Economy Advisor. Help users find potential recycling or barter combinations. For example, if a user has a specific old chair (kursi) and wants a table (meja), suggest creative repurposing ideas or advise how to post their listing effectively. Be concise and write in friendly Bahasa Indonesia.";
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });

        res.json({ text: response.text });
      } catch (err: any) {
        console.error("Gemini Generation Error:", err);
        res.status(500).json({ error: "Gemini error: " + err.message, fallback: true });
      }
    } else {
      // Rule-based fallback if no API key is specified
      let text = "";
      const lower = prompt.toLowerCase();
      if (type === "seo-desc") {
        text = `## Deskripsi Produk SEO-Optimized (Simulasi AI)

Dapatkan **${prompt}** kualitas premium terbaik dari **WZ TEXTILE BY AHM ONLINE GROUP**! Kami selalu mengutamakan keunggulan mutu dan kepuasan pelanggan di bawah pengawasan langsung owner **H. Aang Kurnia**.

### Keunggulan Produk:
* **Bahan Berkualitas Tinggi**: Dipilih khusus menggunakan serat premium untuk ketahanan jangka panjang.
* **Desain Eksklusif**: Model modern yang modis dan ergonomis sesuai tren terkini.
* **Harga Sangat Kompetitif**: Langsung dari produsen/pengrajin UMKM binaan kami.

### Spesifikasi Teknis:
* Kondisi: Baru / Istimewa
* Pengiriman cepat dari Caringin, Garut Selatan.
* Jaminan retur apabila barang tidak sesuai pesanan!

*Pesan sekarang dan nikmati layanan CS responsif kami di WhatsApp 085320200882!*`;
      } else if (type === "barter") {
        text = `### Saran Barter & Daur Ulang Ramah Lingkungan (Simulasi AI)

Berdasarkan barang yang Anda miliki: **"${prompt}"**, berikut adalah beberapa rekomendasi dari WZ Daur Ulang:

1. **Rekomendasi Barter**: Anda dapat menukarkan barang Anda dengan furniture sederhana, kardus pembungkus paket, atau pot bunga daur ulang ban mobil yang bernilai seimbang (Rp 20.000 - Rp 100.000).
2. **Ide Repurposing**: Jika barang tersebut adalah kursi tua, Anda dapat mengamplasnya, memberi cat vernis kayu baru, dan memanfaatkannya sebagai dudukan pot tanaman hias di teras rumah.
3. **Penyaluran Donasi**: Jika Anda memilih mendonasikannya secara gratis, produk ini akan sangat bermanfaat bagi warga Caringin yang sedang menata rumah atau pengrajin lokal untuk bahan baku kriya.`;
      } else {
        text = `Halo! Saya WZ Assistant (Simulasi). Kami menyambut Anda di platform multi-vendor WZ Textile by AHM Online Group Caringin Garut. Ada yang bisa kami bantu hari ini mengenai produk sutra tenun, jasa AC, jual beli hp bekas, atau program tukar barang daur ulang?`;
      }
      res.json({ text, fallback: true });
    }
  });

  // 10. Contact Email Endpoint (Kirim Email ke Admin)
  app.post("/api/admin/contact-email", (req: Request, res: Response) => {
    const { senderName, senderEmail, subject, message, phone, productDetails } = req.body;
    if (!senderName || !message) {
      return res.status(400).json({ error: "Nama pengirim dan pesan wajib diisi." });
    }

    // Simulate sending email (print details cleanly, add an audit log)
    const adminEmail = "wztextile51@gmail.com";
    console.log(`[EMAIL DISPATCH] Sending email to admin: ${adminEmail}`);
    console.log(`Subject: ${subject || "Kontak / Pertanyaan Pelanggan WZ Textile"}`);
    console.log(`From: ${senderName} <${senderEmail || "anonymous@example.com"}> (Phone: ${phone || "N/A"})`);
    console.log(`Message:\n${message}`);
    if (productDetails) {
      console.log(`Attached Product: ${JSON.stringify(productDetails)}`);
    }

    // Write to audit log
    db.addAuditLog(senderName, "Buyer", `Kirim email ke admin dengan subjek: ${subject || "Kontak Admin"}`);

    res.json({
      success: true,
      message: "Email berhasil dikirim ke Admin WZ Textile (wztextile51@gmail.com). Tim kami akan segera merespon via Email atau WhatsApp.",
      dispatchedTo: adminEmail,
      timestamp: new Date().toISOString()
    });
  });

  // ==========================================
  // --- VITE MIDDLEWARE SETUP ---
  // ==========================================
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WZ Textile Fullstack Server running on http://localhost:${PORT}`);
  });
}

startServer();
