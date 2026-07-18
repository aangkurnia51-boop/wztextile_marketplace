/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CategoryType, Product, SellerStore, Order, ChatRoom, Message, UserProfile, AuditLog, ResellerLevel, FAQItem, PromoBanner, BlogArticle, MessageType } from "./types";

// In-Memory Database State
export class DatabaseSim {
  products: Product[] = [];
  stores: SellerStore[] = [];
  orders: Order[] = [];
  chatRooms: ChatRoom[] = [];
  messages: Message[] = [];
  users: UserProfile[] = [];
  auditLogs: AuditLog[] = [];
  faqs: FAQItem[] = [];
  banners: PromoBanner[] = [];
  articles: BlogArticle[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // 1. Initial User Profiles
    this.users = [
      {
        id: "user-1",
        name: "H. Aang Kurnia",
        email: "wztextile51@gmail.com",
        role: "Admin",
        balance: 154500000,
        points: 4500,
        referralCode: "AANGKURNIA51",
        joinedAt: "2025-01-10T08:00:00Z"
      },
      {
        id: "user-2",
        name: "Yusuf Reseller",
        email: "yusuf@gmail.com",
        role: "Seller",
        balance: 3850000,
        points: 1200,
        referralCode: "YUSUFRES",
        joinedAt: "2025-02-15T09:30:00Z"
      },
      {
        id: "user-3",
        name: "Siti Pembeli",
        email: "siti@gmail.com",
        role: "Buyer",
        balance: 500000,
        points: 350,
        referralCode: "SITIBUY",
        joinedAt: "2026-03-01T14:20:00Z"
      }
    ];

    // 2. Initial Seller Stores (The Flagship store is WZ Textile)
    this.stores = [
      {
        id: "store-wz",
        ownerId: "user-1",
        ownerName: "H. Aang Kurnia",
        name: "WZ Textile Flagship Store",
        logo: "https://images.unsplash.com/photo-1524295928322-4b9862f90f38?auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=1200&q=80",
        address: "Jl. Bandung - Rancabuaya - Caringin Garut",
        mapsCoords: { lat: -7.4251, lng: 107.5612 },
        openHours: "08:00 - 18:00",
        rating: 4.9,
        followersCount: 15420,
        balance: 145000000,
        level: ResellerLevel.DIAMOND,
        referralCode: "WZTEXTILE",
        affiliateEarnings: 12500000,
        monthlyBonus: 2500000,
        isApproved: true,
        isVerified: true,
        createdAt: "2025-01-10T08:30:00Z"
      },
      {
        id: "store-yusuf",
        ownerId: "user-2",
        ownerName: "Yusuf Reseller",
        name: "Yusuf AC & Elektronik Caringin",
        logo: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
        banner: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
        address: "Jl. Caringin Indah No. 42, Caringin, Garut",
        mapsCoords: { lat: -7.4265, lng: 107.5625 },
        openHours: "09:00 - 17:00",
        rating: 4.7,
        followersCount: 840,
        balance: 3850000,
        level: ResellerLevel.GOLD,
        referralCode: "YUSUFSERV",
        affiliateEarnings: 850000,
        monthlyBonus: 250000,
        isApproved: true,
        isVerified: true,
        createdAt: "2025-02-15T10:00:00Z"
      }
    ];

    // 3. Initial Products (UMKM, JASA, BEKAS, DAUR ULANG)
    this.products = [
      // === UMKM Kategori ===
      {
        id: "prod-wz-1",
        name: "Sutra Tenun Asli Garut Klasik WZ",
        category: CategoryType.UMKM,
        subcategory: "Fashion & Tekstil",
        price: 1250000,
        discount: 10,
        rating: 4.9,
        location: "Garut",
        description: "Kain sutra tenun ATBM (Alat Tenun Bukan Mesin) buatan asli pengrajin binaan WZ Textile. Menggunakan benang sutra pilihan bertekstur halus, berkilau alami, dan sangat nyaman dipakai untuk busana formal mau pun koleksi prestisius.",
        stock: 45,
        sku: "WZ-SUTRA-001",
        weight: 350,
        length: 200,
        width: 115,
        height: 1,
        minOrder: 1,
        maxOrder: 10,
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "new",
        salesCount: 142,
        createdAt: "2025-01-11T09:00:00Z"
      },
      {
        id: "prod-umkm-2",
        name: "Dodol Garut Wijen Asli Kacang Ijo - Box Premium",
        category: CategoryType.UMKM,
        subcategory: "Makanan & Minuman",
        price: 45000,
        rating: 4.8,
        location: "Garut",
        description: "Dodol manis legit legendaris khas Garut dengan taburan wijen melimpah dan rasa kacang ijo tradisional. Tanpa bahan pengawet buatan, diproses steril dan tahan hingga 3 bulan.",
        stock: 250,
        sku: "DDL-GRT-WIJ",
        weight: 500,
        length: 20,
        width: 12,
        height: 6,
        minOrder: 1,
        maxOrder: 100,
        images: [
          "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "new",
        salesCount: 1845,
        createdAt: "2025-01-12T10:00:00Z"
      },
      {
        id: "prod-umkm-3",
        name: "Sepatu Pantofel Kulit Sapi Sukaregang",
        category: CategoryType.UMKM,
        subcategory: "Fashion & Tekstil",
        price: 320000,
        discount: 15,
        rating: 4.7,
        location: "Garut",
        description: "Sepatu kulit sapi asli premium hasil kerajinan tangan Sukaregang Garut. Awet, elegan, dengan sol dalam super empuk sangat cocok untuk pekerja kantoran maupun acara formal.",
        stock: 35,
        sku: "SKRG-SH-04",
        weight: 900,
        length: 32,
        width: 15,
        height: 12,
        minOrder: 1,
        maxOrder: 5,
        images: [
          "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "new",
        salesCount: 88,
        createdAt: "2025-02-01T11:00:00Z"
      },

      // === JASA Kategori ===
      {
        id: "prod-jasa-1",
        name: "Servis AC Cuci Tambah Freon Bergaransi",
        category: CategoryType.JASA,
        subcategory: "Servis AC & Elektronik",
        price: 150000,
        rating: 4.9,
        location: "Garut Selatan",
        description: "Layanan jasa cuci AC bersih, tambal bocor, isi ulang freon R32/R410, perbaikan modul listrik AC. Pengerjaan cepat, rapi, transparan, dan bergaransi 30 hari. Teknisi berpengalaman siap datang ke rumah.",
        stock: 999,
        sku: "JS-AC-01",
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        minOrder: 1,
        maxOrder: 5,
        images: [
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-yusuf",
        sellerName: "Yusuf AC & Elektronik Caringin",
        condition: "new",
        salesCount: 56,
        createdAt: "2025-02-16T08:00:00Z"
      },
      {
        id: "prod-jasa-2",
        name: "Desain Grafis Spanduk Banner & Kemasan UMKM",
        category: CategoryType.JASA,
        subcategory: "Desain Grafis",
        price: 75000,
        rating: 4.8,
        location: "Online / Caringin",
        description: "Jasa pembuatan desain profesional untuk logo, brosur, banner, kemasan produk makanan/kosmetik, feed Instagram. Free konsultasi, revisi 3 kali, pengerjaan cepat dalam 24-48 jam.",
        stock: 999,
        sku: "JS-DSN-02",
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        minOrder: 1,
        maxOrder: 10,
        images: [
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "new",
        salesCount: 120,
        createdAt: "2025-01-20T14:00:00Z"
      },

      // === BEKAS Kategori ===
      {
        id: "prod-bekas-1",
        name: "iPhone 13 Pro Max 256GB Sierra Blue Bekas Resmi iBox",
        category: CategoryType.BEKAS,
        subcategory: "Handphone & Tablet",
        price: 11800000,
        rating: 4.6,
        location: "Caringin",
        description: "Dijual santai iPhone 13 Pro Max Sierra Blue 256GB. Garansi iBox habis, kemulusan fisik 95% (ada lecet halus pemakaian), Battery Health 82% masih awet seharian, FaceID aktif, Truetone normal. Lengkap box ori dan kabel.",
        stock: 1,
        sku: "BKS-IP13PM-256",
        weight: 240,
        length: 16,
        width: 8,
        height: 1,
        minOrder: 1,
        maxOrder: 1,
        images: [
          "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-yusuf",
        sellerName: "Yusuf AC & Elektronik Caringin",
        condition: "used",
        salesCount: 0,
        createdAt: "2026-07-01T15:00:00Z"
      },
      {
        id: "prod-bekas-2",
        name: "Laptop ASUS VivoBook 14 Core i5 RAM 8GB Bekas Mulus",
        category: CategoryType.BEKAS,
        subcategory: "Komputer & Laptop",
        price: 4950000,
        rating: 4.5,
        location: "Garut",
        description: "Laptop ASUS VivoBook 14 Intel Core i5 Gen 10, RAM 8GB DDR4, SSD NVMe 512GB, layar FHD 14 inch. Kondisi prima, keyboard backlight empuk, speaker jernih kencang, baterai tahan 3 jam standard. Cocok untuk kuliah atau admin online.",
        stock: 1,
        sku: "BKS-ASUS-14",
        weight: 1500,
        length: 34,
        width: 24,
        height: 2,
        minOrder: 1,
        maxOrder: 1,
        images: [
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "used",
        salesCount: 0,
        createdAt: "2026-07-02T16:00:00Z"
      },

      // === DAUR ULANG & BARTER Kategori ===
      {
        id: "prod-recycle-1",
        name: "Kursi Makan Kayu Jati Kokoh",
        category: CategoryType.DAUR_ULANG,
        subcategory: "Tukar Barang (Barter)",
        price: 0,
        rating: 4.8,
        location: "Caringin Garut",
        description: "Memiliki 2 unit kursi makan bahan kayu jati asli sangat kuat. Ingin ditukar/barter dengan meja kerja kayu berukuran minimal 100cm x 60cm yang masih layak pakai.",
        stock: 1,
        sku: "DU-KR-01",
        weight: 12000,
        length: 45,
        width: 45,
        height: 90,
        minOrder: 1,
        maxOrder: 1,
        images: [
          "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "recycle",
        barterFor: "Meja Kerja Minimalis ukuran 100x60cm",
        salesCount: 0,
        createdAt: "2026-07-10T12:00:00Z"
      },
      {
        id: "prod-recycle-2",
        name: "Kardus Karton Bekas Packing Tebal Double Wall",
        category: CategoryType.DAUR_ULANG,
        subcategory: "Barang Gratis (Donasi)",
        price: 0,
        isFree: true,
        rating: 5.0,
        location: "Garut",
        description: "Ada tumpukan sekitar 30 kg kardus karton bekas kiriman tekstil. Tebal, masih utuh tidak basah. Diberikan secara GRATIS / Donasi bagi yang membutuhkan untuk pindahan, daur ulang kreatif, atau penampung rongsok.",
        stock: 1,
        sku: "DU-KD-30",
        weight: 30000,
        length: 80,
        width: 60,
        height: 50,
        minOrder: 1,
        maxOrder: 1,
        images: [
          "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        condition: "recycle",
        salesCount: 0,
        createdAt: "2026-07-12T09:00:00Z"
      },
      {
        id: "prod-recycle-3",
        name: "Pot Bunga Hias Berbahan Ban Mobil Bekas Daur Ulang",
        category: CategoryType.DAUR_ULANG,
        subcategory: "Barang Daur Ulang",
        price: 35000,
        rating: 4.7,
        location: "Caringin",
        description: "Pot bunga hias cantik ramah lingkungan yang diproses dari daur ulang ban mobil bekas. Dilengkapi cat warna-warni anti luntur dan anti pecah. Sangat artistik diletakkan di halaman rumah.",
        stock: 45,
        sku: "DU-POTBAN",
        weight: 4000,
        length: 40,
        width: 40,
        height: 25,
        minOrder: 1,
        maxOrder: 10,
        images: [
          "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80"
        ],
        sellerId: "store-yusuf",
        sellerName: "Yusuf AC & Elektronik Caringin",
        condition: "recycle",
        salesCount: 15,
        createdAt: "2026-07-13T10:00:00Z"
      }
    ];

    // 4. Initial Chat Rooms and Messages
    this.chatRooms = [
      {
        id: "room-1",
        buyerId: "user-3",
        buyerName: "Siti Pembeli",
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        lastMessage: "Apakah Sutra Garut masih ready stok, Pak Aang?",
        unreadCount: 1,
        isOnline: true,
        createdAt: "2026-07-15T11:00:00Z"
      }
    ];

    this.messages = [
      {
        id: "msg-1-1",
        chatRoomId: "room-1",
        senderId: "user-3",
        senderName: "Siti Pembeli",
        content: "Halo admin WZ Textile, selamat pagi.",
        type: "text",
        createdAt: "2026-07-15T11:01:00Z",
        isRead: true
      },
      {
        id: "msg-1-2",
        chatRoomId: "room-1",
        senderId: "store-wz",
        senderName: "WZ Textile Flagship Store",
        content: "Selamat pagi Bu Siti! Ada yang bisa kami bantu mengenai produk tenun atau sutra kami?",
        type: "text",
        createdAt: "2026-07-15T11:03:00Z",
        isRead: true
      },
      {
        id: "msg-1-3",
        chatRoomId: "room-1",
        senderId: "user-3",
        senderName: "Siti Pembeli",
        content: "Apakah Sutra Garut masih ready stok, Pak Aang?",
        type: "text",
        createdAt: "2026-07-15T11:05:00Z",
        isRead: false
      }
    ];

    // 5. Initial Orders
    this.orders = [
      {
        id: "ORD-20260718-001",
        buyerId: "user-3",
        buyerName: "Siti Pembeli",
        sellerId: "store-wz",
        sellerName: "WZ Textile Flagship Store",
        items: [
          {
            product: this.products[0], // Sutra Garut
            quantity: 1,
            selectedVariations: { "Warna": "Krem Sutra", "Ukuran": "Standard" }
          }
        ],
        totalPrice: 1125000, // 1.25M with 10% discount is 1.125M
        shippingMethod: "J&T Express (Reguler)",
        shippingCost: 22000,
        paymentMethod: "QRIS",
        paymentStatus: "Paid",
        status: "Shipping",
        trackingNumber: "JT92184918231",
        trackingLogs: [
          "Order dibuat oleh Siti Pembeli - 2026-07-18T00:05:00Z",
          "Pembayaran berhasil terverifikasi via QRIS GPN - 2026-07-18T00:06:00Z",
          "Pesanan sedang dikemas oleh penjual (WZ Textile) - 2026-07-18T01:10:00Z",
          "Paket diserahkan ke Kurir J&T Caringin Garut - 2026-07-18T02:00:00Z"
        ],
        createdAt: "2026-07-18T00:05:00Z"
      }
    ];

    // 6. Security Audit Logs (RBAC compliance)
    this.auditLogs = [
      {
        id: "log-1",
        username: "H. Aang Kurnia",
        role: "Admin",
        action: "Login Admin Panel Success",
        ipAddress: "182.16.24.88",
        timestamp: "2026-07-18T01:10:00Z"
      },
      {
        id: "log-2",
        username: "Siti Pembeli",
        role: "Buyer",
        action: "Checkout Order ORD-20260718-001 Success",
        ipAddress: "114.122.31.25",
        timestamp: "2026-07-18T00:05:00Z"
      },
      {
        id: "log-3",
        username: "Yusuf Reseller",
        role: "Seller",
        action: "Upload Product (iPhone 13 Pro Max Bekas) Success",
        ipAddress: "180.244.110.15",
        timestamp: "2026-07-18T00:01:00Z"
      }
    ];

    // 7. FAQs
    this.faqs = [
      {
        question: "Bagaimana cara mendaftar menjadi Reseller di WZ Textile?",
        answer: "Sangat mudah! Buka aplikasi, lalu masuk ke Dashboard Seller / Akun. Pilih menu 'Daftar Reseller', isi formulir nama toko, alamat di Jl. Bandung - Rancabuaya, upload logo, dan ajukan verifikasi. Admin WZ Textile akan menyetujui akun toko Anda kurang dari 24 jam.",
        category: "Kemitraan"
      },
      {
        question: "Bagaimana sistem pembayaran dan penarikan saldo di marketplace ini?",
        answer: "Kami mendukung berbagai pembayaran aman seperti QRIS, Virtual Account, Transfer Bank, E-Wallet, dan COD. Setelah pembeli menekan tombol 'Pesanan Diterima', dana penjualan akan masuk ke Saldo Marketplace Anda yang bisa langsung ditarik ke rekening bank Anda secara instan.",
        category: "Pembayaran"
      },
      {
        question: "Apa itu Kategori Daur Ulang / Tukar Barang?",
        answer: "Kategori Daur Ulang adalah menu ramah lingkungan di mana Anda dapat memposting barang untuk barter/tukar-menambah, mendonasikan barang bekas secara gratis, atau menjual hasil kerajinan daur ulang seperti pot ban bekas dan kerajinan serat kelapa.",
        category: "Fitur"
      }
    ];

    // 8. Promo Banners
    this.banners = [
      {
        id: "ban-1",
        title: "Koleksi Sutra Tenun Premium WZ Textile",
        imageUrl: "https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/shop",
        isActive: true
      },
      {
        id: "ban-2",
        title: "Tukar Tambah Barang Bekas & Daur Ulang Ramah Lingkungan",
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
        linkUrl: "/recycle",
        isActive: true
      }
    ];

    // 9. Articles
    this.articles = [
      {
        id: "art-1",
        title: "Mengangkat UMKM Garut ke Kancah Nasional via Marketplace Digital",
        content: "UMKM Garut seperti kerajinan kulit Sukaregang, Dodol khas Garut, dan Tenun Sutra WZ Textile memiliki potensi luar biasa. Dengan hadirnya platform WZ Textile Marketplace Multi-vendor, kita membuka gerbang pasar yang lebih luas bagi jutaan reseller dan pengrajin lokal untuk go-digital secara mandiri dan aman.",
        imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
        author: "H. Aang Kurnia",
        publishedAt: "2026-07-15T09:00:00Z"
      },
      {
        id: "art-2",
        title: "Mengapa Daur Ulang dan Barter Menjadi Solusi Masa Depan",
        content: "Barter barang yang tidak terpakai atau menyumbangkan barang secara gratis bukan hanya menghemat biaya, tapi mengurangi limbah rumah tangga. Menu Daur Ulang di WZ Textile memfasilitasi pertukaran ramah lingkungan ini secara aman di Garut dan sekitarnya.",
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80",
        author: "Admin CS",
        publishedAt: "2026-07-17T10:00:00Z"
      }
    ];
  }

  // --- QUERY METHODS ---

  getProducts(filters: any = {}) {
    let result = [...this.products];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    if (filters.subcategory) {
      result = result.filter(p => p.subcategory === filters.subcategory);
    }

    if (filters.condition) {
      result = result.filter(p => p.condition === filters.condition);
    }

    if (filters.location) {
      result = result.filter(p => p.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.minPrice !== undefined) {
      result = result.filter(p => p.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      result = result.filter(p => p.price <= Number(filters.maxPrice));
    }

    if (filters.isFree !== undefined) {
      result = result.filter(p => p.isFree === (filters.isFree === "true" || filters.isFree === true));
    }

    // Sort mappings
    if (filters.sort) {
      switch (filters.sort) {
        case "terlaris":
          result.sort((a, b) => b.salesCount - a.salesCount);
          break;
        case "terbaru":
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case "termurah":
          result.sort((a, b) => a.price - b.price);
          break;
        case "termahal":
          result.sort((a, b) => b.price - a.price);
          break;
        case "rating":
          result.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return result;
  }

  getProductById(id: string) {
    return this.products.find(p => p.id === id);
  }

  createProduct(productData: Partial<Product>) {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || "Produk Baru",
      category: productData.category || CategoryType.UMKM,
      subcategory: productData.subcategory || "Lain-lain",
      price: productData.price || 0,
      discount: productData.discount,
      rating: 5.0,
      location: productData.location || "Garut",
      description: productData.description || "",
      stock: productData.stock || 1,
      sku: productData.sku || `SKU-${Date.now()}`,
      weight: productData.weight || 100,
      length: productData.length || 10,
      width: productData.width || 10,
      height: productData.height || 10,
      minOrder: productData.minOrder || 1,
      maxOrder: productData.maxOrder || 99,
      images: productData.images || ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"],
      videoUrl: productData.videoUrl,
      pdfUrl: productData.pdfUrl,
      sellerId: productData.sellerId || "store-wz",
      sellerName: productData.sellerName || "WZ Textile Flagship Store",
      condition: productData.condition || "new",
      barterFor: productData.barterFor,
      isFree: productData.isFree || false,
      salesCount: 0,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    this.addAuditLog("Yusuf Reseller", "Seller", `Upload Product ${newProduct.name} (SKU: ${newProduct.sku}) Success`);
    return newProduct;
  }

  getStoreByOwner(ownerId: string) {
    return this.stores.find(s => s.ownerId === ownerId);
  }

  getStoreById(storeId: string) {
    return this.stores.find(s => s.id === storeId);
  }

  createStore(storeData: Partial<SellerStore>) {
    const newStore: SellerStore = {
      id: `store-${Date.now()}`,
      ownerId: storeData.ownerId || "user-3",
      ownerName: storeData.ownerName || "Pembeli Baru",
      name: storeData.name || "Toko Baru Reseller",
      logo: storeData.logo || "https://images.unsplash.com/photo-1524295928322-4b9862f90f38?auto=format&fit=crop&w=200&q=80",
      banner: storeData.banner || "https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=1200&q=80",
      address: storeData.address || "Jl. Bandung - Rancabuaya, Caringin Garut",
      mapsCoords: storeData.mapsCoords || { lat: -7.4251, lng: 107.5612 },
      openHours: storeData.openHours || "08:00 - 17:00",
      rating: 5.0,
      followersCount: 0,
      balance: 0,
      level: ResellerLevel.SILVER,
      referralCode: `REF-${Date.now().toString().slice(-5)}`,
      affiliateEarnings: 0,
      monthlyBonus: 0,
      isApproved: false, // requires admin approval
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    this.stores.push(newStore);
    this.addAuditLog(newStore.ownerName, "Seller", `Apply Reseller Store ${newStore.name} Success`);
    return newStore;
  }

  approveStore(storeId: string) {
    const store = this.stores.find(s => s.id === storeId);
    if (store) {
      store.isApproved = true;
      store.isVerified = true;
      // change user's role to Seller
      const user = this.users.find(u => u.id === store.ownerId);
      if (user) {
        user.role = "Seller";
      }
      this.addAuditLog("H. Aang Kurnia", "Admin", `Approved Reseller Store ${store.name}`);
      return true;
    }
    return false;
  }

  getOrders(userId: string, role: "Buyer" | "Seller" | "Admin") {
    if (role === "Admin") return this.orders;
    if (role === "Seller") {
      const store = this.getStoreByOwner(userId);
      if (!store) return [];
      return this.orders.filter(o => o.sellerId === store.id);
    }
    return this.orders.filter(o => o.buyerId === userId);
  }

  createOrder(orderData: {
    buyerId: string;
    buyerName: string;
    sellerId: string;
    items: { productId: string; quantity: number; selectedVariations: any }[];
    shippingMethod: string;
    shippingCost: number;
    paymentMethod: string;
  }) {
    const sellerStore = this.getStoreById(orderData.sellerId);
    if (!sellerStore) throw new Error("Store not found");

    const orderItems = orderData.items.map(item => {
      const product = this.getProductById(item.productId);
      if (!product) throw new Error("Product not found: " + item.productId);
      
      // Update stock
      product.stock = Math.max(0, product.stock - item.quantity);
      product.salesCount += item.quantity;
      return {
        product,
        quantity: item.quantity,
        selectedVariations: item.selectedVariations
      };
    });

    const itemsTotal = orderItems.reduce((acc, item) => {
      const discountedPrice = item.product.discount 
        ? item.product.price * (1 - item.product.discount / 100) 
        : item.product.price;
      return acc + discountedPrice * item.quantity;
    }, 0);

    const totalPrice = itemsTotal + orderData.shippingCost;
    const orderId = `ORD-${Date.now().toString().slice(-8)}`;

    const newOrder: Order = {
      id: orderId,
      buyerId: orderData.buyerId,
      buyerName: orderData.buyerName,
      sellerId: orderData.sellerId,
      sellerName: sellerStore.name,
      items: orderItems,
      totalPrice,
      shippingMethod: orderData.shippingMethod,
      shippingCost: orderData.shippingCost,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "Paid", // For ease of demo, we simulate instant success
      status: "Paid",
      trackingNumber: `TRK-${Date.now().toString().slice(-8)}`,
      trackingLogs: [
        `Order dibuat oleh ${orderData.buyerName} - ${new Date().toISOString()}`,
        `Pembayaran berhasil terverifikasi via ${orderData.paymentMethod} - ${new Date().toISOString()}`
      ],
      createdAt: new Date().toISOString()
    };

    // Update Seller Balance
    sellerStore.balance += itemsTotal;

    // Award Points to Buyer (1 point per 10k IDR)
    const buyer = this.users.find(u => u.id === orderData.buyerId);
    if (buyer) {
      buyer.points += Math.floor(itemsTotal / 10000);
      buyer.balance = Math.max(0, buyer.balance - totalPrice);
    }

    this.orders.unshift(newOrder);
    this.addAuditLog(orderData.buyerName, "Buyer", `Create Order ${orderId} Total Rp${totalPrice.toLocaleString('id-ID')}`);
    
    // Simulate async dispatch shipping log
    setTimeout(() => {
      newOrder.status = "Shipping";
      newOrder.trackingLogs.push(`Kurir mengambil paket dari Penjual (${sellerStore.name}) - ${new Date().toISOString()}`);
    }, 5000);

    return newOrder;
  }

  // --- CHAT SYSTEM ---

  getChatRooms(userId: string) {
    return this.chatRooms.filter(r => r.buyerId === userId || r.sellerId === userId);
  }

  getMessages(chatRoomId: string) {
    return this.messages.filter(m => m.chatRoomId === chatRoomId);
  }

  sendMessage(chatRoomId: string, senderId: string, senderName: string, content: string, type: MessageType = "text", fileUrl?: string, duration?: number) {
    const room = this.chatRooms.find(r => r.id === chatRoomId);
    if (!room) return null;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatRoomId,
      senderId,
      senderName,
      content,
      type,
      fileUrl,
      duration,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    this.messages.push(newMessage);
    room.lastMessage = content;
    if (senderId === room.buyerId) {
      room.unreadCount += 1;
    }

    // Smart auto-reply for demo if sent to store-wz or store-yusuf
    if (senderId !== room.sellerId) {
      this.simulateSellerReply(room, content);
    }

    return newMessage;
  }

  private simulateSellerReply(room: ChatRoom, buyerContent: string) {
    room.isTyping = true;
    setTimeout(() => {
      let replyContent = "Terima kasih telah menghubungi kami. Pesanan Anda akan kami proses secepatnya!";
      const lower = buyerContent.toLowerCase();

      if (lower.includes("sutra") || lower.includes("tenun")) {
        replyContent = "Kain sutra tenun premium kami diproduksi ATBM asli Garut oleh pengrajin WZ Textile. Produk dijamin asli 100%, stok selalu terverifikasi ready silakan langsung check out!";
      } else if (lower.includes("dodol")) {
        replyContent = "Dodol wijen legendaris kami baru matang kemarin, dijamin empuk legit bebas pengawet! Siap kirim hari ini ke seluruh Indonesia.";
      } else if (lower.includes("ready") || lower.includes("ada")) {
        replyContent = "Barang ini ready siap kirim, Kak! Pemesanan sebelum jam 16:00 WIB kami kirim hari yang sama.";
      } else if (lower.includes("alamat") || lower.includes("caringin")) {
        replyContent = "Toko fisik kami beralamat di: Jl. Bandung - Rancabuaya - Caringin Garut. Silakan datang jika ingin melihat produk tenun langsung!";
      }

      const reply: Message = {
        id: `msg-${Date.now()}-reply`,
        chatRoomId: room.id,
        senderId: room.sellerId,
        senderName: room.sellerName,
        content: replyContent,
        type: "text",
        createdAt: new Date().toISOString(),
        isRead: false
      };

      this.messages.push(reply);
      room.lastMessage = replyContent;
      room.isTyping = false;
    }, 1500);
  }

  createChatRoom(buyerId: string, buyerName: string, sellerId: string, sellerName: string) {
    const existing = this.chatRooms.find(r => r.buyerId === buyerId && r.sellerId === sellerId);
    if (existing) return existing;

    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      buyerId,
      buyerName,
      sellerId,
      sellerName,
      unreadCount: 0,
      isOnline: true,
      createdAt: new Date().toISOString()
    };

    this.chatRooms.push(newRoom);
    return newRoom;
  }

  addAuditLog(username: string, role: string, action: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}`,
      username,
      role,
      action,
      ipAddress: "182.16.24.12",
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    // keep audit logs size under 100 for memory
    if (this.auditLogs.length > 100) {
      this.auditLogs.pop();
    }
  }
}
