/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Server, Database, Code, FolderTree, ShieldAlert, Settings, FileText } from "lucide-react";

export default function DocTabs() {
  const [activeSubTab, setActiveSubTab] = useState<string>("analisis");

  const subTabs = [
    { id: "analisis", label: "Analisis Kebutuhan", icon: FileText },
    { id: "arsitektur", label: "Arsitektur Enterprise", icon: Server },
    { id: "database", label: "Skema DB & ERD", icon: Database },
    { id: "api", label: "Dokumentasi REST API", icon: Code },
    { id: "folder", label: "Struktur Folder", icon: FolderTree },
    { id: "deployment", label: "Deployment & Monitoring", icon: Settings },
  ];

  return (
    <div id="technical-documentation-hub" className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-slate-900 px-6 py-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white font-sans tracking-tight">
          Blueprint & Dokumen Arsitektur Enterprise
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Dokumentasi spesifikasi sistem skala jutaan pengguna untuk WZ TEXTILE BY AHM ONLINE GROUP.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-blue-${tab.id}`}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
                activeSubTab === tab.id
                  ? "border-sky-600 text-sky-600 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8">
        {activeSubTab === "analisis" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3">
                1. Analisis Kebutuhan Sistem & Skalabilitas
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Sistem dirancang khusus untuk mengakomodasi model bisnis multi-vendor dari **AHM Online Group** yang mengintegrasikan UMKM lokal, penyedia Jasa terdekat, penjualan Barang Bekas (secondhand), serta inisiatif Daur Ulang & Barter mandiri di wilayah Caringin - Garut dan nasional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Sasaran Beban Skalabilitas Tinggi:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li><strong className="text-slate-900">10 Juta Pengguna Aktif</strong> dengan retensi tinggi.</li>
                  <li><strong className="text-slate-900">1 Juta Reseller/Toko</strong> yang mengunggah stok dan melayani pembeli.</li>
                  <li><strong className="text-slate-900">50 Juta Produk Aktif</strong> tersebar di 4 kategori utama.</li>
                  <li><strong className="text-slate-900">500.000 Transaksi per Hari</strong> pada saat peak event.</li>
                  <li><strong className="text-slate-900">High Availability 99.9%</strong> dengan mitigasi disaster recovery instan.</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm mb-2">Kebutuhan Fungsional Utama:</h4>
                <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                  <li><strong className="text-slate-900">Multi-Vendor Management</strong>: Verifikasi reseller mandiri & otorisasi toko.</li>
                  <li><strong className="text-slate-900">Real-Time Chat</strong>: Komunikasi instan pembeli dan penjual berbasis WebSocket.</li>
                  <li><strong className="text-slate-900">Search Grounding & Filter</strong>: Pencarian secepat kilat menggunakan reverse-index.</li>
                  <li><strong className="text-slate-900">Payment Gateway</strong>: Integrasi otomatis Midtrans/Xendit untuk mutasi dana otomatis.</li>
                </ul>
              </div>
            </div>

            <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 text-sky-900 text-xs">
              <p className="font-semibold mb-1">💡 Catatan Performa:</p>
              Dengan arsitektur enterprise modern, latensi baca produk dijaga di bawah <strong>50ms</strong> berkat caching Redis terdistribusi, dan latensi tulis diselesaikan asinkronus menggunakan RabbitMQ.
            </div>
          </div>
        )}

        {activeSubTab === "arsitektur" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3">
                2. Arsitektur Aplikasi (Microservices Ecosystem)
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Sistem menerapkan arsitektur <strong className="text-slate-900">Microservices terdistribusi</strong> untuk menjamin skalabilitas independen di setiap modul penting, dideploy di atas Google Cloud Platform (GCP) dengan Kubernetes.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-4 py-2 text-xs font-mono text-slate-700 border-b border-slate-200">
                ALUR TOPOLOGI MICROSERVICES
              </div>
              <pre className="p-4 bg-slate-950 text-emerald-400 font-mono text-[10px] md:text-xs overflow-x-auto leading-relaxed">
{`                        [ USER CLIENTS: Web, Android Flutter ]
                                         │
                                         ▼ (HTTPS / WSS)
                               [ Cloudflare CDN ]
                                         │
                                         ▼
                            [ Nginx API Gateway / Ingress ]
                                         │
  ┌──────────────────────┬───────────────┴──────────────┬────────────────────────┐
  ▼ (Auth Service)       ▼ (Product Service)            ▼ (Order/Billing)        ▼ (Chat & Realtime)
[ NestJS Auth API ]    [ NestJS Product API ]         [ NestJS Order API ]     [ NestJS Socket.io ]
  │                      │                              │                        │
  ├─► Redis Token Cache  ├─► Redis Product Cache        ├─► PostgreSQL (Master)  ├─► Socket.io Nodes
  │                      │                              │                        │
  ▼                      ▼                              ▼                        ▼
[ PostgreSQL DB ]      [ PostgreSQL DB ]              [ Read Replica DB ]      [ Redis Pub/Sub ]
                         │ (Sync Sync)                  │
                         ▼                              ▼
                 [ Elasticsearch Cluster ]       [ Midtrans/Xendit ]
                         ▲
                         │ (Asynchronous Event-driven processing)
                  [ RabbitMQ Message Broker ]`}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 border rounded-xl bg-white">
                <h5 className="font-bold text-slate-800 mb-1">API Gateway & Ingress</h5>
                <p className="text-slate-500">Nginx & Kong mengelola rate limiting, verifikasi JWT terpusat, pengalihan rute mikro, dan proteksi WAF DDoS.</p>
              </div>
              <div className="p-4 border rounded-xl bg-white">
                <h5 className="font-bold text-slate-800 mb-1">RabbitMQ Event Broker</h5>
                <p className="text-slate-500">Menangani antrian asinkronus pendaftaran reseller, notifikasi email/WhatsApp, pembukuan komisi, dan audit logs.</p>
              </div>
              <div className="p-4 border rounded-xl bg-white">
                <h5 className="font-bold text-slate-800 mb-1">Elasticsearch Cluster</h5>
                <p className="text-slate-500">Menyediakan pencarian produk super cepat dengan pencocokan teks fuzzy, filter spasial (jarak GPS), dan sinonim.</p>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "database" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3">
                3. Desain Database & Skema Relasional (PostgreSQL ERD)
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Berikut adalah struktur tabel inti ternormalisasi (3NF) dalam database PostgreSQL untuk mengelola multi-vendor, komisi level, voucher, dan penandaan daur ulang secara akurat.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden font-mono text-xs text-slate-700 bg-slate-50 p-4 space-y-4">
              <div>
                <span className="font-bold text-indigo-700">1. Table: users</span>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg text-[10px] md:text-xs mt-1 overflow-x-auto">
{`CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Buyer', -- 'Buyer', 'Seller', 'Admin'
    balance NUMERIC(15,2) DEFAULT 0,
    points INTEGER DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(20),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>

              <div>
                <span className="font-bold text-indigo-700">2. Table: seller_stores</span>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg text-[10px] md:text-xs mt-1 overflow-x-auto">
{`CREATE TABLE seller_stores (
    id VARCHAR(50) PRIMARY KEY,
    owner_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    address_text TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    open_hours VARCHAR(50),
    rating NUMERIC(2,1) DEFAULT 5.0,
    followers_count INTEGER DEFAULT 0,
    balance NUMERIC(15,2) DEFAULT 0,
    reseller_level VARCHAR(20) DEFAULT 'Silver', -- 'Silver', 'Gold', 'Platinum', 'Diamond'
    affiliate_earnings NUMERIC(15,2) DEFAULT 0,
    monthly_bonus NUMERIC(15,2) DEFAULT 0,
    is_approved BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>

              <div>
                <span className="font-bold text-indigo-700">3. Table: products</span>
                <pre className="bg-slate-950 text-slate-200 p-3 rounded-lg text-[10px] md:text-xs mt-1 overflow-x-auto">
{`CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    seller_id VARCHAR(50) REFERENCES seller_stores(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'UMKM', 'JASA', 'BEKAS', 'DAUR_ULANG'
    subcategory VARCHAR(50),
    price NUMERIC(15,2) DEFAULT 0,
    discount_pct NUMERIC(5,2) DEFAULT 0,
    rating NUMERIC(2,1) DEFAULT 5.0,
    location_text VARCHAR(100),
    description TEXT,
    stock INTEGER DEFAULT 1,
    sku VARCHAR(50) UNIQUE,
    weight_grams INTEGER DEFAULT 0,
    dimensions VARCHAR(50), -- 'W x L x H'
    images TEXT[], -- Array of Image URLs
    video_url TEXT,
    condition VARCHAR(20) DEFAULT 'new', -- 'new', 'used', 'recycle'
    barter_for VARCHAR(150), -- Specified items for swapping
    is_free BOOLEAN DEFAULT FALSE,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "api" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3">
                4. Dokumentasi Kontrak REST API (Enterprise Spec)
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Arsitektur API kami menjamin interoperabilitas yang mudah untuk frontend Web (React/Next.js) dan Android (Flutter).
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-xs">POST</span>
                  <code className="text-xs font-mono font-bold text-slate-800">/api/v1/auth/login</code>
                </div>
                <p className="text-slate-500 text-xs">Mendapatkan JSON Web Token (JWT) yang aman dengan RBAC payload.</p>
                <pre className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[10px] md:text-xs font-mono overflow-x-auto">
{`// REQUEST BODY:
{
  "email": "wztextile51@gmail.com",
  "password": "hashed_password"
}
// RESPONSE (200 OK):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-1",
    "name": "H. Aang Kurnia",
    "role": "Admin",
    "email": "wztextile51@gmail.com"
  }
}`}
                </pre>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-sky-100 text-sky-800 font-bold rounded text-xs">GET</span>
                  <code className="text-xs font-mono font-bold text-slate-800">/api/v1/products</code>
                </div>
                <p className="text-slate-500 text-xs">Mengambil daftar produk dengan filter elastis super cepat.</p>
                <pre className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[10px] md:text-xs font-mono overflow-x-auto">
{`// QUERY PARAMS:
// ?search=sutra&category=UMKM&sort=terlaris&minPrice=100000
// RESPONSE (200 OK):
[
  {
    "id": "prod-wz-1",
    "name": "Sutra Tenun Asli Garut Klasik WZ",
    "price": 1250000,
    "discount": 10,
    "rating": 4.9,
    "location": "Garut",
    "sellerName": "WZ Textile Flagship Store"
  }
]`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === "folder" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3">
                5. Desain Struktur Folder Proyek Enterprise
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Struktur modular monorepo atau modular-monolith yang menjamin tim pengembang frontend dan backend bekerja tanpa konflik.
              </p>
            </div>

            <div className="p-4 bg-slate-950 text-slate-300 rounded-xl font-mono text-xs overflow-x-auto max-h-96">
{`wz-textile-ecosystem/
├── backend-nestjs/               # NestJS Enterprise Backend
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── core/                  # RBAC, Guards, Interceptors, Filters
│   │   ├── database/              # TypeORM/Drizzle, migrations, schemas
│   │   ├── modules/
│   │   │   ├── auth/              # JWT, OTP, RBAC
│   │   │   ├── products/          # CRUD, Media Compressing, Elasticsearch
│   │   │   ├── orders/            # Midtrans Integration, Shipping SDKs
│   │   │   ├── chat/              # Socket.io gateway, chat storage
│   │   │   └── cms/               # Admin banners, blogs, FAQs
│   └── test/                      # Unit & E2E tests
│
├── frontend-nextjs-web/          # Next.js Server-Side Rendered Web App
│   ├── src/
│   │   ├── app/                   # App Router (shop, reseller, admin pages)
│   │   ├── components/            # UI components (shadcn/tailwind)
│   │   ├── hooks/                 # custom react hooks (useCart, useChat)
│   │   └── services/              # API proxies & SDK connections
│
├── mobile-flutter-android/       # Flutter Cross-Platform Android/iOS
│   ├── lib/
│   │   ├── main.dart
│   │   ├── src/
│   │   │   ├── models/            # Product, User, Chat, Order models
│   │   │   ├── views/             # Screens (Home, Detail, Checkout, Chat)
│   │   │   ├── controllers/       # BLoC / Provider state managers
│   │   │   └── services/          # API client with Retrofit/Dio
└── docker-compose.yml             # Local environment orchestrator`}
            </div>
          </div>
        )}

        {activeSubTab === "deployment" && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-slate-900 border-b pb-2 mb-3">
                6. Pedoman Deployment, Monitoring & disaster Recovery
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Panduan operasional devops demi menjaga tingkat kestabilan platform hingga 99.9% uptime.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-200 rounded-xl bg-white">
                <h5 className="font-bold text-slate-800 text-sm mb-2">🚀 CI/CD & Infrastruktur</h5>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Setiap push ke branch <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">main</code> mentrigger GitHub Actions untuk membuat Docker Image, menjalankan unit testing, dan mendeploy container baru ke Google Kubernetes Engine (GKE) secara otomatis melalui metode Rolling Update tanpa downtime.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-white">
                <h5 className="font-bold text-slate-800 text-sm mb-2">📊 Monitoring & Alerts</h5>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Menggunakan Prometheus untuk menarik metrik internal NestJS, diekspor ke dashboard Grafana yang dipantau real-time. Jika penggunaan CPU node melebihi 80% atau persentase error request HTTP meningkat di atas 2%, sistem otomatis memicu auto-scaler Kubernetes dan mengirimkan alert via PagerDuty dan WhatsApp Admin.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <span className="font-semibold">⚠️ Rencana Disaster Recovery (DRP):</span> Backup harian database PostgreSQL disimpan terenkripsi di Google Cloud Storage (R regional) secara periodik. Jika data center utama mengalami kegagalan, DNS failover otomatis mengalihkan lalu lintas ke region cadangan (Multi-region DR) dalam waktu kurang dari 5 menit dengan RPO (Recovery Point Objective) &lt; 1 jam.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
