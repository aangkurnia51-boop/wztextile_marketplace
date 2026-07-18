/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ShoppingBag,
  User,
  Shield,
  MessageSquare,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  MapPin,
  Map,
  Clock,
  Coins,
  Send,
  Upload,
  BarChart3,
  BookOpen,
  ArrowRightLeft,
  Heart,
  Gift,
  Check,
  X,
  FileText,
  Percent,
  Sparkles,
  Info,
  Phone,
  Mail,
  RefreshCw,
  TrendingUp,
  MapPinned
} from "lucide-react";
import { CategoryType, Product, SellerStore, Order, ChatRoom, Message, UserProfile, AuditLog, ResellerLevel, FAQItem, PromoBanner, BlogArticle } from "./types";
import { formatIDR, simulateImageOptimization } from "./utils";
import DocTabs from "./components/DocTabs";
import WzLogo from "./components/WzLogo";
import FloatingContactWidget from "./components/FloatingContactWidget";

export default function App() {
  // Active Profile Selector State
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);

  // Core Data Lists
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<SellerStore[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [articles, setArticles] = useState<BlogArticle[]>([]);

  // Navigation Tabs
  // "marketplace" | "seller" | "admin" | "architecture" | "cms_info"
  const [activeMainTab, setActiveMainTab] = useState<string>("marketplace");

  // Marketplace Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | "ALL">("ALL");
  const [minPriceFilter, setMinPriceFilter] = useState("");
  const [maxPriceFilter, setMaxPriceFilter] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSort, setSelectedSort] = useState("terbaru");
  const [conditionFilter, setConditionFilter] = useState<string>("ALL");
  const [isFreeFilter, setIsFreeFilter] = useState(false);

  // UI Active Modals / Details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<{ [key: string]: number }>({}); // key: productId-variationStr, value: quantity
  const [cartDetails, setCartDetails] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRoom, setActiveChatRoom] = useState<ChatRoom | null>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");

  // Simulated GPS Maps
  const [isSelectingMaps, setIsSelectingMaps] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({ lat: -7.4251, lng: 107.5612 });

  // Gemini AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [aiAssistantPrompt, setAiAssistantPrompt] = useState("");

  // Product Form states
  const [newProdName, setNewProdName] = useState("");
  const [newProdCat, setNewProdCat] = useState<CategoryType>(CategoryType.UMKM);
  const [newProdSub, setNewProdSub] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdDiscount, setNewProdDiscount] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdSku, setNewProdSku] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdWeight, setNewProdWeight] = useState("");
  const [newProdCondition, setNewProdCondition] = useState<"new" | "used" | "recycle">("new");
  const [newProdBarterFor, setNewProdBarterFor] = useState("");
  const [newProdIsFree, setNewProdIsFree] = useState(false);
  const [newProdImages, setNewProdImages] = useState<string[]>([]);
  const [newProdSpecs, setNewProdSpecs] = useState({ length: 15, width: 10, height: 10 });

  // Barter Form States for Buyer Item trade-in
  const [buyerBarterName, setBuyerBarterName] = useState("");
  const [buyerBarterCat, setBuyerBarterCat] = useState("Tukar Barang (Barter)");
  const [buyerBarterDesc, setBuyerBarterDesc] = useState("");
  const [buyerBarterTarget, setBuyerBarterTarget] = useState("");
  const [buyerBarterLocation, setBuyerBarterLocation] = useState("Caringin Garut");
  const [buyerBarterImages, setBuyerBarterImages] = useState<string[]>([]);

  // Image upload simulator states
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadProgress, setUploadProgress] = useState<string[]>([]);

  // Store Profile Update States
  const [storeNameEdit, setStoreNameEdit] = useState("");
  const [storeAddressEdit, setStoreAddressEdit] = useState("");
  const [storeHoursEdit, setStoreHoursEdit] = useState("");

  // Toast / Status notification overlay
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flash Sale & Voucher states
  const [appliedVoucher, setAppliedVoucher] = useState<string | null>(null);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 14, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 2, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll intervals
  const chatPollInterval = useRef<any>(null);

  // Show auto toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. FETCH & HYDRATE DATA ON INITIALIZATION
  const fetchData = async () => {
    try {
      // Profiles
      const pRes = await fetch("/api/auth/profiles");
      const profilesData = await pRes.json();
      setProfiles(profilesData);
      if (profilesData.length > 0 && !activeProfile) {
        // Default to Siti Pembeli (Buyer) for marketplace exploring
        const defaultBuyer = profilesData.find((p: any) => p.role === "Buyer") || profilesData[0];
        setActiveProfile(defaultBuyer);
      }

      // Products
      const prodRes = await fetch("/api/products");
      const prodData = await prodRes.json();
      setProducts(prodData);

      // Stores
      const storesRes = await fetch("/api/stores");
      const storesData = await storesRes.json();
      setStores(storesData);

      // CMS banners & articles & faqs
      const banRes = await fetch("/api/cms/banners");
      const banData = await banRes.json();
      setBanners(banData);

      const artRes = await fetch("/api/cms/articles");
      const artData = await artRes.json();
      setArticles(artData);

      const faqRes = await fetch("/api/cms/faqs");
      const faqData = await faqRes.json();
      setFaqs(faqData);

      // Logs
      const logRes = await fetch("/api/audit-logs");
      const logData = await logRes.json();
      setAuditLogs(logData);
    } catch (err) {
      console.error("Error fetching data from full-stack server:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch orders and chatrooms when profile or tab changes
  useEffect(() => {
    if (!activeProfile) return;

    const fetchUserSpecificData = async () => {
      try {
        const orderRes = await fetch(`/api/orders?userId=${activeProfile.id}&role=${activeProfile.role}`);
        const orderData = await orderRes.json();
        setOrders(orderData);

        const chatRes = await fetch(`/api/chat/rooms?userId=${activeProfile.id}`);
        const chatData = await chatRes.json();
        setChatRooms(chatData);

        // Pre-fill reseller edit fields if active profile is seller
        if (activeProfile.role === "Seller" || activeProfile.role === "Admin") {
          const storeRes = await fetch(`/api/stores/owner/${activeProfile.id}`);
          const storeData = await storeRes.json();
          if (storeData) {
            setStoreNameEdit(storeData.name);
            setStoreAddressEdit(storeData.address);
            setStoreHoursEdit(storeData.openHours);
            setSelectedCoords(storeData.mapsCoords);
          }
        }
      } catch (err) {
        console.error("Error fetching user-specific data:", err);
      }
    };

    fetchUserSpecificData();
  }, [activeProfile, activeMainTab]);

  // Chat message polling
  useEffect(() => {
    if (activeChatRoom) {
      const fetchMessages = async () => {
        try {
          const res = await fetch(`/api/chat/rooms/${activeChatRoom.id}/messages`);
          const msgData = await res.json();
          setActiveChatMessages(msgData);
        } catch (err) {
          console.error("Error polling chat messages:", err);
        }
      };
      
      fetchMessages();
      // Poll every 4 seconds
      chatPollInterval.current = setInterval(fetchMessages, 4000);
    } else {
      if (chatPollInterval.current) {
        clearInterval(chatPollInterval.current);
      }
    }

    return () => {
      if (chatPollInterval.current) {
        clearInterval(chatPollInterval.current);
      }
    };
  }, [activeChatRoom]);

  // Sync Cart items with detail maps
  useEffect(() => {
    const list = Object.keys(cart).map((key) => {
      const prodId = key.split("|")[0];
      const variationsStr = key.split("|")[1] || "{}";
      const product = products.find((p) => p.id === prodId);
      if (product) {
        return {
          product,
          quantity: cart[key],
          selectedVariations: JSON.parse(variationsStr),
          cartKey: key,
        };
      }
      return null;
    }).filter(Boolean);
    setCartDetails(list);
  }, [cart, products]);

  // 2. INTERACTION HANDLERS

  // Change Profile
  const handleProfileChange = (profileId: string) => {
    const selected = profiles.find((p) => p.id === profileId);
    if (selected) {
      setActiveProfile(selected);
      // reset state views
      setActiveChatRoom(null);
      setIsChatOpen(false);
      setSelectedProduct(null);
      triggerToast(`Berhasil masuk sebagai ${selected.name} (${selected.role})`);
    }
  };

  // Search & Filter action (Advanced Fast Search)
  const getFilteredProducts = () => {
    let list = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "ALL") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (conditionFilter !== "ALL") {
      list = list.filter((p) => p.condition === conditionFilter);
    }

    if (selectedLocation) {
      list = list.filter((p) => p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
    }

    if (minPriceFilter) {
      list = list.filter((p) => p.price >= Number(minPriceFilter));
    }

    if (maxPriceFilter) {
      list = list.filter((p) => p.price <= Number(maxPriceFilter));
    }

    if (isFreeFilter) {
      list = list.filter((p) => p.isFree === true);
    }

    // Sort
    if (selectedSort === "terlaris") {
      list.sort((a, b) => b.salesCount - a.salesCount);
    } else if (selectedSort === "terbaru") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (selectedSort === "termurah") {
      list.sort((a, b) => a.price - b.price);
    } else if (selectedSort === "termahal") {
      list.sort((a, b) => b.price - a.price);
    } else if (selectedSort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  };

  // Add to Cart
  const handleAddToCart = (product: Product, variations: any = {}) => {
    const varStr = JSON.stringify(variations);
    const key = `${product.id}|${varStr}`;
    setCart((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + 1,
    }));
    triggerToast(`"${product.name}" berhasil ditambahkan ke keranjang!`);
  };

  // Remove from Cart
  const handleRemoveFromCart = (key: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  // Adjust quantity
  const handleCartQtyChange = (key: string, change: number) => {
    setCart((prev) => {
      const current = prev[key] || 0;
      const next = current + change;
      if (next <= 0) {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      }
      return {
        ...prev,
        [key]: next,
      };
    });
  };

  // Checkout Simulation
  const handleCheckout = async (shippingMethod: string, paymentMethod: string) => {
    if (!activeProfile) return;
    if (cartDetails.length === 0) return;

    const sellerId = cartDetails[0].product.sellerId;
    const items = cartDetails.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      selectedVariations: item.selectedVariations,
    }));

    // Calculate shipping cost
    const shippingCost = shippingMethod.includes("Express") ? 25000 : 12000;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: activeProfile.id,
          buyerName: activeProfile.name,
          sellerId,
          items,
          shippingMethod,
          shippingCost,
          paymentMethod,
        }),
      });

      if (res.ok) {
        const newOrder = await res.json();
        // Clear Cart
        setCart({});
        setIsCartOpen(false);
        // Refresh orders and general user balance
        fetchData();
        triggerToast(`Pemesanan Berhasil! ID: ${newOrder.id}. Pembayaran terverifikasi via ${paymentMethod}.`);
        setActiveMainTab("marketplace"); // Return to market
      } else {
        const err = await res.json();
        triggerToast(`Gagal checkout: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Gagal memproses pesanan.");
    }
  };

  // Instant Checkout (One-Click Buy)
  const handleInstantCheckout = async (product: Product) => {
    if (!activeProfile) {
      triggerToast("Silakan login/pilih profil simulasi terlebih dahulu.");
      return;
    }

    const finalPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    const discountFactor = appliedVoucher === "DISKON50" ? 0.5 : 1.0;
    const shipping = appliedVoucher === "ONGKIRGRATIS" ? 0 : 12000;
    const finalTotal = (finalPrice * discountFactor) + shipping;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: activeProfile.id,
          buyerName: activeProfile.name,
          sellerId: product.sellerId,
          items: [{
            product,
            productId: product.id,
            quantity: 1,
            selectedVariations: { "Tipe": "Standar" }
          }],
          shippingMethod: "Kurir Kilat (Instant)",
          shippingCost: shipping,
          paymentMethod: "QRIS",
        }),
      });

      if (res.ok) {
        const newOrder = await res.json();
        // Refresh data
        fetchData();
        triggerToast(`⚡ Beli Instan Sukses! Transaksi Anda telah terkonfirmasi. Total: ${formatIDR(finalTotal)}.`);
        setActiveMainTab("marketplace");
        setSelectedProduct(null);
      } else {
        const err = await res.json();
        triggerToast(`Gagal Beli Instan: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Gagal melakukan checkout cepat.");
    }
  };

  // Open Chat Room with Seller
  const handleStartChat = async (sellerId: string, sellerName: string) => {
    if (!activeProfile) {
      triggerToast("Silakan masuk terlebih dahulu.");
      return;
    }

    try {
      const res = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: activeProfile.id,
          buyerName: activeProfile.name,
          sellerId,
          sellerName,
        }),
      });

      if (res.ok) {
        const room = await res.json();
        setChatRooms((prev) => {
          if (prev.some((r) => r.id === room.id)) return prev;
          return [room, ...prev];
        });
        setActiveChatRoom(room);
        setIsChatOpen(true);
        setSelectedProduct(null); // Close detail modal
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Send Message
  const handleSendMessage = async (type: "text" | "location" | "image" | "voice" = "text", contentPayload = "") => {
    if (!activeChatRoom || !activeProfile) return;

    let content = chatInput;
    let fileUrl = undefined;
    let duration = undefined;

    if (type === "location") {
      content = "📍 Mengirim lokasi: Jl. Bandung - Rancabuaya - Caringin Garut (-7.4251, 107.5612)";
    } else if (type === "image") {
      content = "🖼️ Mengirim foto produk tenun";
      fileUrl = "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80";
    } else if (type === "voice") {
      content = "🎤 Pesan Suara (Voice Note)";
      duration = 8;
    }

    if (!content && type === "text") return;

    try {
      const res = await fetch(`/api/chat/rooms/${activeChatRoom.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: activeProfile.id,
          senderName: activeProfile.name,
          content,
          type,
          fileUrl,
          duration,
        }),
      });

      if (res.ok) {
        const msg = await res.json();
        setActiveChatMessages((prev) => [...prev, msg]);
        setChatInput("");
        // trigger scroll bottom simulated
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Become Reseller Apply Form
  const handleApplyReseller = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    try {
      const res = await fetch("/api/reseller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ownerId: activeProfile.id,
          ownerName: activeProfile.name,
          name: storeNameEdit || `${activeProfile.name} Boutique`,
          address: storeAddressEdit || "Jl. Bandung - Rancabuaya - Caringin Garut",
          openHours: storeHoursEdit || "08:00 - 18:00",
          mapsCoords: selectedCoords,
        }),
      });

      if (res.ok) {
        const store = await res.json();
        setStores((prev) => [...prev, store]);
        triggerToast("Pendaftaran Reseller Berhasil! Menunggu persetujuan Admin WZ Textile.");
        fetchData(); // reload
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin approves reseller store
  const handleApproveStore = async (storeId: string) => {
    try {
      const res = await fetch(`/api/reseller/approve/${storeId}`, { method: "POST" });
      if (res.ok) {
        triggerToast("Toko Reseller Berhasil Disetujui & Diverifikasi!");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Upload Product with Simulated Resize & Compression
  const handleProductImageSimulate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadProgress([]);
    setUploadStatus("Memulai optimasi gambar...");

    const logStatus = (statusStr: string) => {
      setUploadProgress((prev) => [...prev, statusStr]);
    };

    try {
      const result = await simulateImageOptimization(file, logStatus);
      setNewProdImages((prev) => [...prev, result.url]);
      setUploadStatus(`Sukses! Selesai kompresi: ${result.sizeBefore} -> ${result.sizeAfter} (Tereduksi 82%)`);
    } catch (err) {
      setUploadStatus("Gagal mengompresi gambar.");
    }
  };

  // Upload Product manual Form submission
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    // Get active seller store ID
    const sellerStore = stores.find((s) => s.ownerId === activeProfile.id);
    if (!sellerStore) {
      triggerToast("Anda harus memiliki toko yang terverifikasi.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProdName,
          category: newProdCat,
          subcategory: newProdSub || "Lain-lain",
          price: Number(newProdPrice),
          discount: newProdDiscount ? Number(newProdDiscount) : undefined,
          description: newProdDesc,
          stock: Number(newProdStock),
          sku: newProdSku || `WZ-SKU-${Date.now().toString().slice(-4)}`,
          weight: Number(newProdWeight),
          length: newProdSpecs.length,
          width: newProdSpecs.width,
          height: newProdSpecs.height,
          images: newProdImages.length > 0 ? newProdImages : ["https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"],
          sellerId: sellerStore.id,
          sellerName: sellerStore.name,
          condition: newProdCondition,
          barterFor: newProdCondition === "recycle" ? newProdBarterFor : undefined,
          isFree: newProdIsFree,
        }),
      });

      if (res.ok) {
        triggerToast("Produk berhasil diupload dan disiarkan secara nasional!");
        // Reset form
        setNewProdName("");
        setNewProdSub("");
        setNewProdPrice("");
        setNewProdDiscount("");
        setNewProdStock("");
        setNewProdSku("");
        setNewProdDesc("");
        setNewProdWeight("");
        setNewProdImages([]);
        setNewProdBarterFor("");
        setNewProdIsFree(false);
        setUploadProgress([]);
        setUploadStatus("");

        fetchData(); // reload products list
      } else {
        const err = await res.json();
        triggerToast(`Gagal upload: ${err.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Buyer submits an item for Barter/Donasi
  const handleBuyerPostBarter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buyerBarterName,
          category: CategoryType.DAUR_ULANG,
          subcategory: buyerBarterCat,
          price: 0,
          description: buyerBarterDesc,
          stock: 1,
          sku: `BARTER-${Date.now().toString().slice(-4)}`,
          weight: 5000,
          length: 50,
          width: 50,
          height: 50,
          images: buyerBarterImages.length > 0 ? buyerBarterImages : ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80"],
          sellerId: "user-buyer-sim", // special simulated buyer listing
          sellerName: activeProfile.name,
          condition: "recycle",
          barterFor: buyerBarterCat.includes("Barter") ? buyerBarterTarget : undefined,
          isFree: buyerBarterCat.includes("Gratis") || buyerBarterCat.includes("Donasi"),
        }),
      });

      if (res.ok) {
        triggerToast("Barang Barter/Donasi Anda berhasil diposting di Marketplace!");
        setBuyerBarterName("");
        setBuyerBarterDesc("");
        setBuyerBarterTarget("");
        setBuyerBarterImages([]);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Buyer Barter Image Upload Simulator
  const handleBuyerBarterImageSimulate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      const result = await simulateImageOptimization(file, () => {});
      setBuyerBarterImages([result.url]);
    } catch (err) {
      console.error(err);
    }
  };

  // Reseller updates store profile & Simulated Google Maps Coordinates
  const handleUpdateStoreProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    const sellerStore = stores.find((s) => s.ownerId === activeProfile.id);
    if (!sellerStore) return;

    try {
      const res = await fetch(`/api/reseller/store/${sellerStore.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: storeNameEdit,
          address: storeAddressEdit,
          openHours: storeHoursEdit,
          mapsCoords: selectedCoords,
        }),
      });

      if (res.ok) {
        triggerToast("Profil Toko & Lokasi Maps Berhasil Diperbarui!");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Reseller updates order status (Unpaid -> Paid -> Shipping -> Completed)
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: string, trackingLog: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, trackingLog }),
      });

      if (res.ok) {
        triggerToast(`Status Pesanan ${orderId} berhasil diubah ke ${nextStatus}!`);
        fetchData();
        // Refresh local user orders list
        const orderRes = await fetch(`/api/orders?userId=${activeProfile?.id}&role=${activeProfile?.role}`);
        const orderData = await orderRes.json();
        setOrders(orderData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // DELETE a product
  const handleDeleteProduct = async (prodId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      const res = await fetch(`/api/products/${prodId}`, { method: "DELETE" });
      if (res.ok) {
        triggerToast("Produk berhasil dihapus dari marketplace!");
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. GEMINI AI SERVER-SIDE INTEGRATION
  const handleAskGemini = async (type: "seo-desc" | "barter" | "general") => {
    setAiLoading(true);
    setAiResponseText("");

    let prompt = aiAssistantPrompt;
    if (type === "seo-desc" && selectedProduct) {
      prompt = `Buatkan deskripsi produk SEO-optimized yang sangat menjual dalam bahasa Indonesia untuk produk berikut:
Nama Produk: ${selectedProduct.name}
Kategori: ${selectedProduct.category} - ${selectedProduct.subcategory}
Harga: ${formatIDR(selectedProduct.price)}
Spesifikasi: Berat ${selectedProduct.weight}g, Dimensi ${selectedProduct.length}x${selectedProduct.width}x${selectedProduct.height} cm.
Kondisi: ${selectedProduct.condition === "new" ? "Baru" : "Bekas"}`;
    } else if (type === "barter" && selectedProduct) {
      prompt = `Berikan ide barter, saran daur ulang ramah lingkungan, atau nilai sisa kebermanfaatan bagi barang daur ulang/barter ini:
Nama Barang: ${selectedProduct.name}
Deskripsi awal: ${selectedProduct.description}
Saran barter yang diminta pemilik: ${selectedProduct.barterFor || "Tidak spesifik"}`;
    }

    try {
      const res = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponseText(data.text);
        if (data.fallback) {
          triggerToast("Menampilkan simulasi respons AI pintar (server-side fallback).");
        } else {
          triggerToast("Gemini 3.5 Flash sukses menghasilkan respons!");
        }
      } else {
        triggerToast("Gagal memanggil Gemini.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error koneksi asisten AI.");
    } finally {
      setAiLoading(false);
    }
  };

  // Calculations for Admin Analytics tab (d3 simulation)
  const calculateAdminStats = () => {
    const totalOmzet = orders.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.totalPrice, 0);
    const platformCommission = totalOmzet * 0.05; // 5% fee
    const resellerEarnings = totalOmzet - platformCommission;
    const activeSellersCount = stores.filter(s => s.isApproved).length;

    return {
      omzet: totalOmzet + 245000000, // add historical baseline for scale demo
      laba: platformCommission + 12500000,
      komisi: platformCommission + 8400000,
      sellers: activeSellersCount + 1420,
      buyers: 8432
    };
  };

  const adminStats = calculateAdminStats();

  // Find active seller store if verified
  const activeSellerStore = activeProfile ? stores.find((s) => s.ownerId === activeProfile.id) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-slide-in">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-medium font-mono">{toastMessage}</span>
        </div>
      )}

      {/* TOP BRAND BAR (WZ TEXTILE BY AHM ONLINE GROUP) */}
      <header className="bg-gradient-to-r from-emerald-950 via-green-900 to-emerald-950 text-white shadow-md border-b border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <WzLogo isGreenTheme={true} className="w-11 h-11 filter drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)]" />
            <div>
              <h1 className="text-base font-extrabold tracking-wider font-sans text-emerald-300">
                WZ TEXTILE BY AHM ONLINE GROUP
              </h1>
              <p className="text-[10px] text-emerald-100 font-mono tracking-tight flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-400" />
                Jl. Bandung - Rancabuaya - Caringin Garut | Owner: H. Aang Kurnia
              </p>
            </div>
          </div>

          {/* Quick Contact & Role Selector Box */}
          <div className="flex flex-wrap items-center gap-3 bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-800/50">
            <div className="hidden lg:flex items-center gap-4 text-xs font-mono mr-3 border-r border-emerald-800 pr-3 text-emerald-200">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-emerald-400" /> 085320200882
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-emerald-400" /> wztextile51@gmail.com
              </span>
            </div>

            {/* Profile switching role selector - ESSENTIAL FOR THE DEMO INTERACTION */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-300 uppercase font-mono flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Simulasi Role:
              </span>
              <select
                value={activeProfile?.id || ""}
                onChange={(e) => handleProfileChange(e.target.value)}
                className="bg-emerald-900 text-xs font-semibold text-white px-3 py-1.5 rounded-lg border border-emerald-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* CORE NAVIGATION BAR */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex overflow-x-auto py-1">
            <button
              onClick={() => {
                setActiveMainTab("marketplace");
                setSelectedCategory("ALL");
              }}
              className={`px-5 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeMainTab === "marketplace"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Marketplace Hub
            </button>

            {activeProfile?.role === "Seller" && (
              <button
                onClick={() => setActiveMainTab("seller")}
                className={`px-5 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeMainTab === "seller"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Reseller Dashboard
              </button>
            )}

            {/* If Buyer has applied, they can see status or open store */}
            {activeProfile?.role === "Buyer" && (
              <button
                onClick={() => setActiveMainTab("seller")}
                className={`px-5 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeMainTab === "seller"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Coins className="w-4 h-4 text-emerald-500" />
                Mulai Berjualan (Daftar Reseller)
              </button>
            )}

            {activeProfile?.role === "Admin" && (
              <button
                onClick={() => setActiveMainTab("admin")}
                className={`px-5 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeMainTab === "admin"
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Shield className="w-4 h-4 text-indigo-500" />
                Admin Panel Control
              </button>
            )}

            <button
              onClick={() => setActiveMainTab("architecture")}
              className={`px-5 py-4 font-bold text-sm border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                activeMainTab === "architecture"
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              Sistem Blueprint (ERD/API)
            </button>
          </div>

          {/* Cart & Messages quick buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all"
              title="Real-time Chat"
            >
              <MessageSquare className="w-5 h-5" />
              {chatRooms.some((r) => r.unreadCount > 0) && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
              )}
            </button>

            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-all flex items-center"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartDetails.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-mono font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {cartDetails.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* 1. TAB: MARKETPLACE HUB */}
        {activeMainTab === "marketplace" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* SIDEBAR FILTERS */}
            <aside className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                <span className="font-bold text-slate-900 text-xs tracking-wider uppercase flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-sky-600" /> Filter Pencarian
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("ALL");
                    setConditionFilter("ALL");
                    setSelectedLocation("");
                    setMinPriceFilter("");
                    setMaxPriceFilter("");
                    setIsFreeFilter(false);
                  }}
                  className="text-[11px] text-sky-600 hover:underline font-semibold"
                >
                  Reset Semua
                </button>
              </div>

              {/* Category selector capsules */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Kategori Utama</label>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCategory === "ALL"
                        ? "bg-sky-50 text-sky-700 font-bold border-l-4 border-sky-600 pl-2"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>Semua Kategori</span>
                    <span className="bg-slate-100 text-slate-500 font-mono text-[9px] px-1.5 py-0.5 rounded">
                      {products.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(CategoryType.UMKM)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCategory === CategoryType.UMKM
                        ? "bg-amber-50 text-amber-700 font-bold border-l-4 border-amber-500 pl-2"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">🏷️ UMKM / Produk Baru</span>
                    <span className="bg-amber-100 text-amber-800 font-mono text-[9px] px-1.5 py-0.5 rounded">
                      {products.filter((p) => p.category === CategoryType.UMKM).length}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(CategoryType.JASA)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCategory === CategoryType.JASA
                        ? "bg-purple-50 text-purple-700 font-bold border-l-4 border-purple-500 pl-2"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">🛠️ Jasa / Servis</span>
                    <span className="bg-purple-100 text-purple-800 font-mono text-[9px] px-1.5 py-0.5 rounded">
                      {products.filter((p) => p.category === CategoryType.JASA).length}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(CategoryType.BEKAS)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCategory === CategoryType.BEKAS
                        ? "bg-rose-50 text-rose-700 font-bold border-l-4 border-rose-500 pl-2"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">♻️ Barang Bekas</span>
                    <span className="bg-rose-100 text-rose-800 font-mono text-[9px] px-1.5 py-0.5 rounded">
                      {products.filter((p) => p.category === CategoryType.BEKAS).length}
                    </span>
                  </button>

                  <button
                    onClick={() => setSelectedCategory(CategoryType.DAUR_ULANG)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedCategory === CategoryType.DAUR_ULANG
                        ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-500 pl-2"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">📦 Barter & Daur Ulang</span>
                    <span className="bg-emerald-100 text-emerald-800 font-mono text-[9px] px-1.5 py-0.5 rounded">
                      {products.filter((p) => p.category === CategoryType.DAUR_ULANG).length}
                    </span>
                  </button>
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Rentang Harga (Rp)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceFilter}
                    onChange={(e) => setMinPriceFilter(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-sky-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceFilter}
                    onChange={(e) => setMaxPriceFilter(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Location filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Lokasi Penjual / Reseller</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-sky-500"
                >
                  <option value="">Semua Lokasi</option>
                  <option value="Garut">Garut (Umum)</option>
                  <option value="Caringin">Caringin Garut</option>
                  <option value="Garut Selatan">Garut Selatan</option>
                  <option value="Bandung">Bandung</option>
                </select>
              </div>

              {/* Sort filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Urutkan Berdasarkan</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:border-sky-500 font-medium"
                >
                  <option value="terbaru">Terbaru Diposting</option>
                  <option value="terlaris">Terlaris (Paling Populer)</option>
                  <option value="termurah">Harga: Termurah</option>
                  <option value="termahal">Harga: Termahal</option>
                  <option value="rating">Rating Penilaian</option>
                </select>
              </div>

              {/* Special options */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  Opsi Tambahan
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFreeFilter}
                    onChange={(e) => setIsFreeFilter(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600 font-semibold select-none flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-emerald-500" /> Barang Gratis / Donasi
                  </span>
                </label>
              </div>

              {/* Custom Poster Form for Barter/Donation directly in Sidebar if they want to clear household items */}
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-3 mt-4">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase font-mono">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-600" /> Tukar Barang Anda
                </span>
                <p className="text-[11px] text-emerald-700 leading-normal">
                  Punya barang tak terpakai di rumah? Posting disini untuk barter atau donasi secara gratis ke warga Caringin Garut!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory(CategoryType.DAUR_ULANG);
                    setConditionFilter("recycle");
                    triggerToast("Silakan isi formulir di bawah produk untuk memposting barang barter.");
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition-all"
                >
                  Posting Barang Barter
                </button>
              </div>
            </aside>

            {/* PRODUCT GRID SECTION */}
            <section className="lg:col-span-3 space-y-6">

              {/* Search Bar Container */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
                <div className="relative w-full">
                  <Search className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari Tenun Sutra WZ, Jasa Cuci AC, HP Bekas, atau barang Daur Ulang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 outline-none focus:border-emerald-500 text-slate-700 transition-all font-sans"
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-xs font-mono font-bold text-emerald-700 whitespace-nowrap bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                    Hasil: {getFilteredProducts().length} produk
                  </span>
                </div>
              </div>

              {/* Promo Banner Slider Simulation */}
              <div className="relative rounded-3xl overflow-hidden aspect-[3/1] bg-emerald-950 border border-emerald-800 shadow-lg">
                <img
                  src={banners[0]?.imageUrl || "https://images.unsplash.com/photo-1558244661-d248897f7bc4?auto=format&fit=crop&w=1200&q=80"}
                  alt="Banner"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent flex flex-col justify-end p-5 md:p-6">
                  <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/95 px-2.5 py-1 rounded-full w-max tracking-wider font-mono border border-emerald-800 mb-2">
                    Promo Unggulan WZ Textile
                  </span>
                  <h3 className="text-white text-sm md:text-lg font-black leading-tight tracking-tight max-w-xl font-sans">
                    {banners[0]?.title || "Koleksi Sutra Tenun Premium WZ Textile"}
                  </h3>
                  <p className="text-emerald-200 text-[10px] mt-1 hidden md:block">
                    Karya seni tenun legendaris Garut dipimpin langsung H. Aang Kurnia. Jaminan kualitas orisinal terbaik.
                  </p>
                </div>
              </div>

              {/* KEJAR DISKON KILAT (SUPER FLASH SALE & COUPONS) */}
              <div className="bg-gradient-to-br from-emerald-900 via-green-950 to-emerald-950 rounded-3xl p-5 md:p-6 border border-emerald-850 shadow-xl space-y-4 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-emerald-800/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-rose-600 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full animate-pulse shadow-md shadow-rose-600/30">
                      ⚡ KILAT
                    </span>
                    <div>
                      <h3 className="font-extrabold text-sm md:text-base tracking-tight text-white flex items-center gap-1.5">
                        Kejar Diskon Kilat WZ Textile
                      </h3>
                      <p className="text-[10px] text-emerald-300 font-medium">Promo spesial kilat & voucher terbatas, klaim sekarang!</p>
                    </div>
                  </div>
                  
                  {/* Countdown clock */}
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-850">
                    <span className="text-emerald-400 text-[9px] mr-1 uppercase">Sisa Waktu:</span>
                    <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[11px]">{String(countdown.hours).padStart(2, "0")}</span>
                    <span className="text-emerald-500 font-black">:</span>
                    <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[11px]">{String(countdown.minutes).padStart(2, "0")}</span>
                    <span className="text-emerald-500 font-black">:</span>
                    <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded text-[11px]">{String(countdown.seconds).padStart(2, "0")}</span>
                  </div>
                </div>

                {/* Voucher Claim Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Voucher 1 */}
                  <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800/60 flex items-center justify-between gap-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-all" />
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-extrabold text-rose-400 font-mono">Spesial Tenun</span>
                      <h4 className="font-black text-xs text-white">Voucher Diskon 50%</h4>
                      <p className="text-[9px] text-emerald-300">Min. Belanja Rp 100K</p>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedVoucher("DISKON50");
                        triggerToast("🎉 Voucher Diskon 50% berhasil diklaim! Diskon akan langsung memotong total belanja Anda.");
                      }}
                      disabled={appliedVoucher === "DISKON50"}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                        appliedVoucher === "DISKON50"
                          ? "bg-emerald-800 text-emerald-400 cursor-not-allowed"
                          : "bg-amber-400 hover:bg-amber-500 text-emerald-950 shadow-md shadow-amber-400/25"
                      }`}
                    >
                      {appliedVoucher === "DISKON50" ? "Terklaim" : "Klaim"}
                    </button>
                  </div>

                  {/* Voucher 2 */}
                  <div className="bg-emerald-950/80 p-3.5 rounded-2xl border border-emerald-800/60 flex items-center justify-between gap-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl group-hover:scale-150 transition-all" />
                    <div className="space-y-0.5">
                      <span className="text-[8px] uppercase font-extrabold text-sky-400 font-mono">Caringin Garut</span>
                      <h4 className="font-black text-xs text-white">Voucher Bebas Ongkir</h4>
                      <p className="text-[9px] text-emerald-300">Tanpa Minimal Belanja</p>
                    </div>
                    <button
                      onClick={() => {
                        setAppliedVoucher("ONGKIRGRATIS");
                        triggerToast("🚚 Voucher Bebas Ongkir berhasil diklaim! Pengiriman dari Caringin Garut menjadi gratis.");
                      }}
                      disabled={appliedVoucher === "ONGKIRGRATIS"}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer ${
                        appliedVoucher === "ONGKIRGRATIS"
                          ? "bg-emerald-800 text-emerald-400 cursor-not-allowed"
                          : "bg-amber-400 hover:bg-amber-500 text-emerald-950 shadow-md shadow-amber-400/25"
                      }`}
                    >
                      {appliedVoucher === "ONGKIRGRATIS" ? "Terklaim" : "Klaim"}
                    </button>
                  </div>
                </div>

                {/* Featured Fast Flash sale product row */}
                <div className="bg-emerald-950/50 p-3.5 rounded-2xl border border-emerald-850 space-y-2.5">
                  <span className="text-[9px] uppercase font-black tracking-wider text-amber-300 font-mono flex items-center gap-1.5">
                    🔥 REKOMENDASI KILAT HARI INI (STOK TERBATAS)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {products.slice(0, 3).map((prod) => {
                      const flashPrice = prod.price * 0.5;
                      return (
                        <div
                          key={`flash-${prod.id}`}
                          onClick={() => setSelectedProduct(prod)}
                          className="bg-emerald-950/95 p-2.5 rounded-xl border border-emerald-800/80 flex items-center gap-3 relative group cursor-pointer hover:border-emerald-500 transition-all"
                        >
                          <img src={prod.images[0]} className="w-10 h-10 object-cover rounded-lg border border-emerald-800 flex-shrink-0" alt="" />
                          <div className="flex-grow min-w-0">
                            <h5 className="font-extrabold text-[10px] text-white line-clamp-1 group-hover:text-amber-300 transition-colors">{prod.name}</h5>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[8px] font-extrabold bg-rose-600 text-white px-1 rounded">-50%</span>
                              <span className="font-extrabold text-[10px] text-white">{formatIDR(flashPrice)}</span>
                            </div>
                            {/* Stock progress bar */}
                            <div className="mt-1 space-y-0.5">
                              <div className="w-full bg-emerald-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full" style={{ width: "85%" }} />
                              </div>
                              <span className="text-[7.5px] text-emerald-300 block font-mono">85% Terjual</span>
                            </div>
                          </div>
                          {/* Buy button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstantCheckout({ ...prod, discount: 50 });
                            }}
                            className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-[9px] px-2 py-1.5 rounded-lg flex-shrink-0 uppercase cursor-pointer"
                            title="Beli Cepat"
                          >
                            Beli
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {getFilteredProducts().map((product) => {
                  const isDiscounted = product.discount && product.discount > 0;
                  const finalPrice = isDiscounted
                    ? product.price * (1 - product.discount! / 100)
                    : product.price;

                  return (
                    <div
                      key={product.id}
                      id={`product-card-${product.id}`}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col group"
                      onClick={() => setSelectedProduct(product)}
                    >
                      {/* Product Image & Badges */}
                      <div className="relative aspect-square bg-slate-100 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Category specific coloring banner */}
                        <span
                          className={`absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase font-mono shadow ${
                            product.category === CategoryType.UMKM
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : product.category === CategoryType.JASA
                              ? "bg-purple-100 text-purple-800 border border-purple-300"
                              : product.category === CategoryType.BEKAS
                              ? "bg-rose-100 text-rose-800 border border-rose-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          {product.category}
                        </span>

                        {product.condition === "recycle" && (
                          <span className="absolute bottom-3 left-3 bg-emerald-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <ArrowRightLeft className="w-2.5 h-2.5" /> Barter/Daur Ulang
                          </span>
                        )}

                        {product.isFree && (
                          <span className="absolute bottom-3 left-3 bg-indigo-600 text-white font-mono font-bold text-[9px] px-2 py-0.5 rounded shadow flex items-center gap-1">
                            <Gift className="w-2.5 h-2.5" /> GRATIS / DONASI
                          </span>
                        )}

                        {isDiscounted && (
                          <span className="absolute top-3 right-3 bg-rose-500 text-white font-mono font-black text-xs px-2 py-1 rounded shadow">
                            -{product.discount}%
                          </span>
                        )}
                      </div>

                      {/* Info body */}
                      <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-400 font-bold tracking-tight font-mono">
                            {product.subcategory}
                          </p>
                          <h4 className="text-slate-900 font-bold text-xs tracking-tight line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </h4>
                        </div>

                        {/* Price rendering */}
                        <div>
                          {product.isFree ? (
                            <span className="text-emerald-600 font-black text-sm tracking-tight flex items-center gap-1">
                              GRATIS (Donasi)
                            </span>
                          ) : product.price === 0 && product.barterFor ? (
                            <div className="text-emerald-700 font-black text-xs font-mono leading-tight bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                              ♻️ Ditukar: <span className="text-slate-700">{product.barterFor}</span>
                            </div>
                          ) : (
                            <div className="space-y-0.5">
                              {isDiscounted && (
                                <p className="text-[10px] text-slate-400 line-through">
                                  {formatIDR(product.price)}
                                </p>
                              )}
                              <p className="text-slate-900 font-black text-sm tracking-tight">
                                {formatIDR(finalPrice)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Location, Rating, Seller info */}
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium border-t pt-2.5 border-slate-100">
                          <span className="flex items-center gap-0.5">
                            📍 {product.location}
                          </span>
                          <span className="flex items-center gap-0.5 font-bold text-slate-700">
                            ⭐ {product.rating}
                          </span>
                          <span>
                            Terjual {product.salesCount}
                          </span>
                        </div>

                        {/* Instant Quick Buy action directly on the card */}
                        <div className="pt-2 border-t border-dashed border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInstantCheckout(product);
                            }}
                            className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-xl transition-all uppercase tracking-wider flex items-center justify-center gap-1 border border-emerald-100/40 cursor-pointer shadow-xs"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" /> Beli Instan
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* POST BARTER LISTING FORM FOR END USER (BUYER) */}
              {selectedCategory === CategoryType.DAUR_ULANG && (
                <div className="bg-emerald-900 text-white rounded-3xl p-6 md:p-8 border border-emerald-800 shadow-xl space-y-6">
                  <div className="space-y-1 max-w-xl">
                    <span className="text-[10px] font-extrabold tracking-wider bg-emerald-950 px-3 py-1 rounded-full text-emerald-400 border border-emerald-800">
                      GUDANG DAUR ULANG & DONASI CARINGIN
                    </span>
                    <h3 className="text-xl font-extrabold tracking-tight pt-2">
                      Posting Barang yang Ingin Anda Barter / Donasikan
                    </h3>
                    <p className="text-emerald-100 text-xs">
                      Formulir asisten digital ramah lingkungan untuk masyarakat Garut. Isilah detail barang di bawah ini.
                    </p>
                  </div>

                  <form onSubmit={handleBuyerPostBarter} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-bold text-emerald-200">Nama Barang Anda</label>
                        <input
                          type="text"
                          required
                          placeholder="Misal: Kursi Makan Jati Tua Bekas"
                          value={buyerBarterName}
                          onChange={(e) => setBuyerBarterName(e.target.value)}
                          className="w-full p-3 bg-emerald-950 rounded-xl border border-emerald-800 text-white outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-emerald-200">Jenis Transaksi</label>
                        <select
                          value={buyerBarterCat}
                          onChange={(e) => setBuyerBarterCat(e.target.value)}
                          className="w-full p-3 bg-emerald-950 rounded-xl border border-emerald-800 text-white outline-none focus:border-emerald-400 font-bold"
                        >
                          <option value="Tukar Barang (Barter)">Tukar Barang (Barter)</option>
                          <option value="Barang Gratis (Donasi)">Donasikan Gratis (Donasi)</option>
                          <option value="Barang Daur Ulang">Jual Barang Hasil Daur Ulang</option>
                        </select>
                      </div>

                      {buyerBarterCat === "Tukar Barang (Barter)" && (
                        <div className="space-y-1">
                          <label className="font-bold text-amber-300">Ingin Ditukar Dengan Apa?</label>
                          <input
                            type="text"
                            required
                            placeholder="Misal: Meja Belajar Anak Khas Kayu"
                            value={buyerBarterTarget}
                            onChange={(e) => setBuyerBarterTarget(e.target.value)}
                            className="w-full p-3 bg-emerald-950 rounded-xl border border-emerald-800 text-white outline-none focus:border-amber-400 font-bold"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <label className="font-bold text-emerald-200">Deskripsi Kondisi Barang</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Jelaskan kemulusan barang, cacat atau ukuran agar calon penukar mengerti..."
                          value={buyerBarterDesc}
                          onChange={(e) => setBuyerBarterDesc(e.target.value)}
                          className="w-full p-3 bg-emerald-950 rounded-xl border border-emerald-800 text-white outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-bold text-emerald-200 flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-emerald-400" /> Upload Foto Barang (Manual/Drop)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBuyerBarterImageSimulate}
                          className="block w-full text-[11px] text-emerald-200 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-950 file:text-emerald-300 hover:file:bg-emerald-900 cursor-pointer"
                        />
                        {buyerBarterImages.length > 0 && (
                          <div className="flex gap-2">
                            <img src={buyerBarterImages[0]} className="w-12 h-12 object-cover rounded-lg border border-emerald-700" alt="Uploaded Preview" />
                            <span className="text-[10px] text-emerald-300 flex items-center">Preview Foto Siap Diposting</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider"
                      >
                        Posting ke Gudang Daur Ulang Sekarang
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </section>
          </div>
        )}

        {/* 2. TAB: SELLER/RESELLER CENTER */}
        {activeMainTab === "seller" && (
          <div className="space-y-6 animate-fade-in">

            {/* Check if Seller store is registered and approved */}
            {!activeSellerStore ? (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 max-w-2xl mx-auto space-y-6 shadow-sm">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-sans tracking-tight">
                    Mulai Berjualan di WZ Textile Marketplace
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Buka toko multi-vendor Anda sendiri dan jual hasil karya UMKM, penyedia Jasa, barang Bekas, atau produk daur ulang Anda ke jutaan pengguna.
                  </p>
                </div>

                <form onSubmit={handleApplyReseller} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Nama Toko Reseller</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Yusuf Tenun Garut"
                      value={storeNameEdit}
                      onChange={(e) => setStoreNameEdit(e.target.value)}
                      className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Alamat Lengkap Toko</label>
                    <input
                      type="text"
                      required
                      placeholder="Misal: Jl. Bandung - Rancabuaya No. 12, Caringin Garut"
                      value={storeAddressEdit}
                      onChange={(e) => setStoreAddressEdit(e.target.value)}
                      className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* MAPS COORDINATES SIMULATOR SECTION */}
                  <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                        <MapPinned className="w-4 h-4 text-sky-600 animate-bounce" /> Pin Lokasi di Google Maps
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSelectingMaps(!isSelectingMaps)}
                        className="text-xs text-sky-600 font-semibold hover:underline"
                      >
                        {isSelectingMaps ? "Tutup Peta" : "Buka Peta Pilih Lokasi"}
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono">
                      Lokasi terpilih: {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)} (Dekat Jl. Bandung - Rancabuaya Caringin)
                    </p>

                    {isSelectingMaps && (
                      <div className="aspect-[3/1] bg-sky-100 rounded-xl overflow-hidden border border-sky-300 relative">
                        {/* Mock Map Image */}
                        <div className="absolute inset-0 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <MapPin className="w-8 h-8 text-rose-600 mx-auto fill-rose-200" />
                            <span className="bg-slate-900 text-[10px] text-white px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap shadow-md">
                              Caringin Garut
                            </span>
                          </div>
                          {/* Map buttons to pan/mock change */}
                          <div className="absolute bottom-3 right-3 bg-white p-1 rounded-lg border shadow-md flex gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedCoords({ lat: -7.4251, lng: 107.5612 })}
                              className="px-2 py-1 bg-sky-50 text-[10px] rounded hover:bg-sky-100 text-slate-700 font-bold"
                            >
                              Sektor Caringin
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedCoords({ lat: -7.4325, lng: 107.5588 })}
                              className="px-2 py-1 bg-sky-50 text-[10px] rounded hover:bg-sky-100 text-slate-700 font-bold"
                            >
                              Sektor Rancabuaya
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Jam Operasional Toko</label>
                    <input
                      type="text"
                      placeholder="Misal: Senin - Sabtu: 08:00 - 17:00"
                      value={storeHoursEdit}
                      onChange={(e) => setStoreHoursEdit(e.target.value)}
                      className="w-full p-3 bg-slate-50 border rounded-xl outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all uppercase tracking-wider text-xs"
                  >
                    Kirim Formulir Buka Toko
                  </button>
                </form>
              </div>
            ) : !activeSellerStore.isApproved ? (
              <div className="bg-amber-50 text-amber-800 rounded-2xl p-6 border border-amber-200 max-w-md mx-auto text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
                <h4 className="font-bold text-base">Menunggu Verifikasi Admin</h4>
                <p className="text-xs text-amber-700 leading-normal">
                  Pendaftaran toko Anda <strong>"{activeSellerStore.name}"</strong> sedang diperiksa oleh Admin Utama **H. Aang Kurnia**. Perubahan status disetujui akan di-update dalam waktu singkat.
                </p>
                <div className="p-3 bg-white/60 rounded-xl text-[11px] font-mono border border-amber-100">
                  Tip Simulasi: Ganti role profil di pojok kanan atas ke <strong>H. Aang Kurnia (Admin)</strong> untuk menyetujui toko Anda secara instan!
                </div>
              </div>
            ) : (
              // FULL SELLER ACTIVE DASHBOARD
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Dashboard stats & Store info column */}
                <div className="space-y-6">
                  {/* Shop Profile Box */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <img src={activeSellerStore.logo} className="w-14 h-14 object-cover rounded-xl border" alt="Store Logo" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">{activeSellerStore.name}</h4>
                          <Check className="w-4 h-4 text-emerald-500 bg-emerald-50 rounded-full border border-emerald-300 p-0.5" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-600 uppercase font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1 inline-block">
                          Level {activeSellerStore.level} Reseller
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-medium space-y-2 text-slate-600 border-t pt-3 border-slate-100">
                      <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {activeSellerStore.address}</p>
                      <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {activeSellerStore.openHours}</p>
                      <p className="flex items-center gap-1.5"><Coins className="w-3.5 h-3.5 text-slate-400" /> Rating Toko: ⭐ {activeSellerStore.rating}</p>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between text-emerald-900">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider font-mono">Saldo Penjualan</p>
                        <h3 className="text-base font-extrabold">{formatIDR(activeSellerStore.balance)}</h3>
                      </div>
                      <button
                        onClick={() => {
                          // mock draw money
                          triggerToast("Dana berhasil ditransfer ke rekening penampungan Bank Anda secara aman!");
                        }}
                        className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                      >
                        Tarik Saldo
                      </button>
                    </div>

                    {/* Affiliate referrers box */}
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-700">Program Afiliasi Reseller</span>
                        <span className="text-sky-600">Leaderboard</span>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Kode Referral Toko Anda: <strong className="text-slate-800 font-mono">{activeSellerStore.referralCode}</strong>
                      </p>
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600 mt-1">
                        <span>Bonus Komisi Bulanan: {formatIDR(activeSellerStore.monthlyBonus)}</span>
                        <span>Affiliate Share: 10%</span>
                      </div>
                    </div>
                  </div>

                  {/* UPDATE STORE INFORMATION FORM */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <h4 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider">Edit Profil Toko</h4>
                    <form onSubmit={handleUpdateStoreProfile} className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Nama Toko</label>
                        <input
                          type="text"
                          required
                          value={storeNameEdit}
                          onChange={(e) => setStoreNameEdit(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Alamat Fisik</label>
                        <input
                          type="text"
                          required
                          value={storeAddressEdit}
                          onChange={(e) => setStoreAddressEdit(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg font-bold"
                      >
                        Simpan Perubahan
                      </button>
                    </form>
                  </div>
                </div>

                {/* PRODUCT UPLOAD & MANAGEMENT COLUMN */}
                <div className="lg:col-span-2 space-y-6">

                  {/* ACTIVE PRODUCTS LISTED */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider">Produk Toko Anda ({products.filter(p => p.sellerId === activeSellerStore.id).length})</h4>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {products.filter(p => p.sellerId === activeSellerStore.id).map(p => (
                        <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs font-semibold">
                          <div className="flex items-center gap-2.5">
                            <img src={p.images[0]} className="w-10 h-10 object-cover rounded-lg border" alt={p.name} />
                            <div>
                              <p className="text-slate-900 line-clamp-1 leading-normal">{p.name}</p>
                              <div className="flex gap-2 text-[10px] text-slate-500 font-medium font-mono">
                                <span>SKU: {p.sku}</span>
                                <span>Stok: {p.stock}</span>
                                <span className="text-emerald-600 font-bold">{formatIDR(p.price)}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg"
                            title="Hapus Produk"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MANUALLY UPLOAD NEW PRODUCT FORM */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-slate-900 font-bold text-sm uppercase font-mono tracking-wider flex items-center gap-1">
                        <Plus className="w-4 h-4 text-emerald-500" /> Upload Produk Baru Anda
                      </h3>
                      <p className="text-slate-500 text-[11px]">
                        Isi form spesifikasi lengkap berikut untuk mendistribusikan produk Anda secara instan ke pembeli nasional.
                      </p>
                    </div>

                    <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Nama Produk</label>
                            <input
                              type="text"
                              required
                              placeholder="Misal: Sarung Sutra WZ Tenun Garut"
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Kategori Utama</label>
                            <select
                              value={newProdCat}
                              onChange={(e) => setNewProdCat(e.target.value as CategoryType)}
                              className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none font-bold"
                            >
                              <option value={CategoryType.UMKM}>🏷️ UMKM / Produk Baru</option>
                              <option value={CategoryType.JASA}>🛠️ Jasa / Servis</option>
                              <option value={CategoryType.BEKAS}>♻️ Barang Bekas</option>
                              <option value={CategoryType.DAUR_ULANG}>📦 Barter & Daur Ulang</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Subkategori / Tag</label>
                            <input
                              type="text"
                              placeholder="Misal: Fashion, Kuliner, Elektronik"
                              value={newProdSub}
                              onChange={(e) => setNewProdSub(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Harga (Rp)</label>
                              <input
                                type="number"
                                required
                                placeholder="Harga Jual"
                                value={newProdPrice}
                                onChange={(e) => setNewProdPrice(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Diskon (%)</label>
                              <input
                                type="number"
                                placeholder="Opsional"
                                value={newProdDiscount}
                                onChange={(e) => setNewProdDiscount(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Stok Tersedia</label>
                              <input
                                type="number"
                                required
                                placeholder="Ketersediaan"
                                value={newProdStock}
                                onChange={(e) => setNewProdStock(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">SKU Toko</label>
                              <input
                                type="text"
                                placeholder="Kode Unik SKU"
                                value={newProdSku}
                                onChange={(e) => setNewProdSku(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Right side form */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Berat (gram)</label>
                              <input
                                type="number"
                                required
                                placeholder="Berat Paket"
                                value={newProdWeight}
                                onChange={(e) => setNewProdWeight(e.target.value)}
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Kondisi</label>
                              <select
                                value={newProdCondition}
                                onChange={(e) => setNewProdCondition(e.target.value as any)}
                                className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                              >
                                <option value="new">Baru</option>
                                <option value="used">Bekas</option>
                                <option value="recycle">Daur Ulang</option>
                              </select>
                            </div>
                          </div>

                          {newProdCondition === "recycle" && (
                            <div className="space-y-1 p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                              <label className="font-bold text-emerald-800">Target Barang Barter (Opsional)</label>
                              <input
                                type="text"
                                placeholder="Misal: Kursi Makan Jati"
                                value={newProdBarterFor}
                                onChange={(e) => setNewProdBarterFor(e.target.value)}
                                className="w-full p-2 bg-white border border-emerald-300 rounded outline-none"
                              />
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="font-bold text-slate-700">Deskripsi Lengkap Produk</label>
                            <textarea
                              rows={4}
                              required
                              placeholder="Deskripsikan bahan tenun sutra Anda, garansi servis AC Anda, kemulusan gadget bekas, dll..."
                              value={newProdDesc}
                              onChange={(e) => setNewProdDesc(e.target.value)}
                              className="w-full p-2.5 bg-slate-50 border rounded-lg outline-none"
                            />
                          </div>

                          {/* DRAG DROP / OPTIMIZED FILE UPLOAD COMPONENT */}
                          <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-2 text-center relative hover:bg-slate-100 transition-all">
                            <div className="space-y-1">
                              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                              <p className="font-bold text-slate-700">Upload Foto (Resize & Compress Otomatis)</p>
                              <p className="text-[10px] text-slate-500">Mendukung drag-and-drop foto produk tenun/barang</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleProductImageSimulate}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />

                            {uploadStatus && (
                              <p className="text-[10px] font-bold text-indigo-600 mt-1">{uploadStatus}</p>
                            )}

                            {uploadProgress.length > 0 && (
                              <div className="text-[9px] font-mono text-slate-500 space-y-0.5 text-left bg-white p-2 rounded border border-slate-200">
                                {uploadProgress.map((p, idx) => (
                                  <p key={idx} className="flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-500" /> {p}
                                  </p>
                                ))}
                              </div>
                            )}

                            {newProdImages.length > 0 && (
                              <div className="flex gap-1.5 justify-center mt-2 flex-wrap">
                                {newProdImages.map((img, index) => (
                                  <img key={index} src={img} className="w-10 h-10 object-cover rounded-lg border" alt="Uploaded Preview" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all uppercase tracking-wider text-xs"
                      >
                        Publish Produk ke Marketplace Nasional
                      </button>
                    </form>
                  </div>

                  {/* INCOMING CLIENT ORDERS PANEL */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="text-slate-900 font-bold text-xs uppercase font-mono tracking-wider">Kelola Pesanan Masuk Pelanggan ({orders.length})</h3>

                    {orders.length === 0 ? (
                      <p className="text-xs text-slate-500">Belum ada pesanan masuk ke toko Anda.</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="p-4 border rounded-xl bg-slate-50 border-slate-200 text-xs space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                              <div>
                                <p className="font-bold text-slate-900">ID Pesanan: {order.id}</p>
                                <p className="text-[10px] text-slate-500 font-mono">Pembeli: {order.buyerName}</p>
                              </div>
                              <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                                order.status === "Paid"
                                  ? "bg-amber-100 text-amber-800"
                                  : order.status === "Shipping"
                                  ? "bg-sky-100 text-sky-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {order.status}
                              </span>
                            </div>

                            {/* Ordered items list */}
                            <div className="space-y-1.5">
                              {order.items.map((item, index) => (
                                <p key={index} className="font-semibold text-slate-700">
                                  - {item.product.name} x {item.quantity} ({JSON.stringify(item.selectedVariations)})
                                </p>
                              ))}
                              <p className="font-bold text-slate-900 mt-1">Total Transaksi: {formatIDR(order.totalPrice)}</p>
                            </div>

                            {/* Action to update status simulation */}
                            <div className="flex gap-2 justify-end pt-2 border-t border-slate-200/50">
                              {order.status === "Paid" && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Shipping", "Kurir WZ menyerahkan paket ke logistik Hub")}
                                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]"
                                >
                                  Kirim Pesanan (Diserahkan ke Kurir)
                                </button>
                              )}
                              {order.status === "Shipping" && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, "Completed", "Paket diterima langsung oleh Pembeli Siti")}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px]"
                                >
                                  Selesaikan Pesanan (Diterima Pembeli)
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. TAB: ADMIN PANEL CONTROL */}
        {activeMainTab === "admin" && (
          <div className="space-y-6 animate-fade-in">
            {/* Global Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Platform Omzet</span>
                <h3 className="text-lg md:text-xl font-black text-indigo-950 mt-1">{formatIDR(adminStats.omzet)}</h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Platform Laba Bersih</span>
                <h3 className="text-lg md:text-xl font-black text-indigo-950 mt-1">{formatIDR(adminStats.laba)}</h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Komisi Terbayar</span>
                <h3 className="text-lg md:text-xl font-black text-emerald-600 mt-1">{formatIDR(adminStats.komisi)}</h3>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Mitra Reseller Aktif</span>
                <h3 className="text-lg md:text-xl font-black text-sky-600 mt-1">{adminStats.sellers}</h3>
              </div>
            </div>

            {/* d3 Simulation Line Graph / Dashboard Visualization */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider">Grafik Kunjungan & Omzet Bulanan (Simulasi D3)</h3>
                  <p className="text-[11px] text-slate-400">Peningkatan transaksi WZ Textile AHM Group semester terakhir.</p>
                </div>
                <div className="flex gap-4 text-[10px] font-bold text-slate-600">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-sky-500 rounded-full" /> Pengunjung (K)</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-600 rounded-full" /> Omzet (Juta Rp)</span>
                </div>
              </div>

              {/* Vector Bar Charts */}
              <div className="h-44 flex items-end gap-3.5 pt-6 border-b border-l pb-1 pl-1">
                {[
                  { month: "Jan", visitors: 40, sales: 85 },
                  { month: "Feb", visitors: 58, sales: 110 },
                  { month: "Mar", visitors: 72, sales: 145 },
                  { month: "Apr", visitors: 88, sales: 172 },
                  { month: "Mei", visitors: 112, sales: 210 },
                  { month: "Jun", visitors: 145, sales: 254 },
                ].map((item, index) => (
                  <div key={index} className="w-full flex flex-col items-center h-full justify-end group cursor-pointer relative">
                    <div className="flex gap-1 w-full h-full items-end justify-center">
                      <div
                        style={{ height: `${(item.visitors / 150) * 100}%` }}
                        className="w-4 bg-sky-500 rounded-t-sm group-hover:opacity-80 transition-opacity"
                        title={`Pengunjung: ${item.visitors}K`}
                      />
                      <div
                        style={{ height: `${(item.sales / 300) * 100}%` }}
                        className="w-4 bg-indigo-600 rounded-t-sm group-hover:opacity-80 transition-opacity"
                        title={`Omzet: Rp ${item.sales} Juta`}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* LIST OF RESELLER APPLICATION & SECURITY LOGS RBAC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Pending Stores Application List */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" /> Verifikasi Pendaftaran Reseller
                </h4>

                <div className="divide-y divide-slate-100">
                  {stores.map((store) => (
                    <div key={store.id} className="py-3 flex items-center justify-between gap-4 text-xs font-semibold">
                      <div>
                        <p className="text-slate-900 font-bold">{store.name}</p>
                        <p className="text-[10px] text-slate-500 font-medium">Pemilik: {store.ownerName} | Alamat: {store.address}</p>
                      </div>

                      {store.isApproved ? (
                        <span className="text-emerald-600 bg-emerald-50 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                          Disetujui
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveStore(store.id)}
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg"
                        >
                          Setujui & Verifikasi
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SECURITY AUDIT LOGS TRAIL (RBAC compliant compliance display) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-rose-600" /> Audit Logs Aktivitas Keamanan (RBAC)
                </h4>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 max-h-56 overflow-y-auto space-y-2 font-mono text-[10px]">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="text-emerald-400 border-b border-slate-900 pb-1.5 last:border-0">
                      <p className="text-slate-400">
                        [{new Date(log.timestamp).toLocaleTimeString()}] - <strong className="text-sky-400">{log.username} ({log.role})</strong>:
                      </p>
                      <p className="pl-2 mt-0.5">{log.action}</p>
                      <p className="text-slate-500 pl-2 text-[9px]">IP: {log.ipAddress}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TAB: BLUEPRINT ARCHITECTURE DETAILS */}
        {activeMainTab === "architecture" && <DocTabs />}
      </main>

      {/* --- FLOATING REAL-TIME CHAT & GEMINI ASSISTANT CLIENT DRAWER --- */}
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 md:right-12 z-40 bg-white w-full sm:w-96 h-[500px] shadow-2xl rounded-t-3xl border border-slate-200 flex flex-col justify-between overflow-hidden animate-slide-in">
          
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              <div>
                <h4 className="font-bold text-xs">Chat Real-Time WZ</h4>
                <p className="text-[10px] text-slate-400 font-mono">Aktif sebagai: {activeProfile?.name}</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-grow flex overflow-hidden">
            {/* Rooms sidebar if not selected */}
            {!activeChatRoom ? (
              <div className="w-full divide-y overflow-y-auto">
                <p className="p-3 text-[10px] font-mono uppercase text-slate-400 bg-slate-50 font-bold">Daftar Obrolan</p>
                {chatRooms.length === 0 ? (
                  <p className="p-4 text-xs text-slate-500 text-center">Belum ada obrolan aktif. Silakan klik "Hubungi Penjual" di halaman detail produk.</p>
                ) : (
                  chatRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setActiveChatRoom(room)}
                      className="p-3 text-xs font-semibold hover:bg-slate-50 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="text-slate-900 font-bold">{activeProfile?.role === "Buyer" ? room.sellerName : room.buyerName}</p>
                        <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{room.lastMessage || "Mulai kirim pesan..."}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))
                )}
              </div>
            ) : (
              // Active room messages
              <div className="w-full flex flex-col justify-between h-full bg-slate-50">
                {/* Back bar */}
                <div className="bg-slate-100 p-2 border-b flex justify-between items-center text-xs">
                  <button onClick={() => setActiveChatRoom(null)} className="text-sky-600 font-bold">
                    &larr; Kembali
                  </button>
                  <span className="font-bold text-slate-800">
                    {activeProfile?.role === "Buyer" ? activeChatRoom.sellerName : activeChatRoom.buyerName}
                  </span>
                  <div className="w-3" />
                </div>

                {/* Messages feed */}
                <div className="flex-grow overflow-y-auto p-3 space-y-2.5">
                  {activeChatMessages.map((msg) => {
                    const isOwn = msg.senderId === activeProfile?.id;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                        <div className={`p-2.5 rounded-2xl text-xs max-w-[80%] leading-normal ${
                          isOwn ? "bg-slate-900 text-white rounded-br-none" : "bg-white text-slate-800 border rounded-bl-none"
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[8px] text-slate-400 mt-0.5 font-mono">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  {activeChatRoom.isTyping && (
                    <div className="flex items-center gap-1 bg-white p-2 rounded-xl border w-max text-[9px] font-mono text-slate-500 animate-pulse">
                      Penjual sedang mengetik...
                    </div>
                  )}
                </div>

                {/* Quick actions panel */}
                <div className="bg-white p-1.5 border-t border-slate-100 flex gap-1 items-center justify-center text-[10px] font-bold text-slate-600">
                  <button onClick={() => handleSendMessage("location")} className="bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border">
                    📍 Kirim Lokasi
                  </button>
                  <button onClick={() => handleSendMessage("image")} className="bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border">
                    🖼️ Kirim Foto
                  </button>
                  <button onClick={() => handleSendMessage("voice")} className="bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border">
                    🎤 Suara
                  </button>
                </div>

                {/* Input block */}
                <div className="bg-white p-2.5 border-t flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Tulis pesan..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage("text")}
                    className="w-full p-2 bg-slate-100 text-xs rounded-xl border border-slate-200 outline-none"
                  />
                  <button
                    onClick={() => handleSendMessage("text")}
                    className="p-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CART DRAWER OVERLAY --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between overflow-hidden shadow-2xl animate-slide-in">
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm uppercase font-mono">Keranjang Belanja Anda</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items feed */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {cartDetails.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">Keranjang belanja Anda kosong.</p>
                </div>
              ) : (
                cartDetails.map((item) => (
                  <div key={item.cartKey} className="flex gap-4 border-b pb-4 text-xs font-semibold">
                    <img src={item.product.images[0]} className="w-14 h-14 object-cover rounded-xl border" alt={item.product.name} />
                    <div className="flex-grow space-y-1">
                      <p className="text-slate-900">{item.product.name}</p>
                      <p className="text-[10px] text-slate-500">Variasi: {JSON.stringify(item.selectedVariations)}</p>
                      <p className="text-emerald-600 font-bold">{formatIDR(item.product.price)}</p>
                      {/* Qty selectors */}
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => handleCartQtyChange(item.cartKey, -1)} className="px-2 py-0.5 bg-slate-100 rounded hover:bg-slate-200">-</button>
                        <span className="font-mono text-slate-800">{item.quantity}</span>
                        <button onClick={() => handleCartQtyChange(item.cartKey, 1)} className="px-2 py-0.5 bg-slate-100 rounded hover:bg-slate-200">+</button>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveFromCart(item.cartKey)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg align-top">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Checkout parameters selection form */}
            {cartDetails.length > 0 && (
              <div className="p-5 border-t bg-slate-50 space-y-4 text-xs font-semibold text-slate-700">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Pilih Jasa Pengiriman</label>
                  <select id="shipping-selector" className="w-full p-2.5 bg-white border rounded-lg text-xs font-bold text-slate-800">
                    <option value="J&T Express (Reguler) - Rp 22.000">J&T Express (Reguler) - Rp 22.000</option>
                    <option value="JNE Express (YES) - Rp 35.000">JNE Express (YES) - Rp 35.000</option>
                    <option value="Sicepat Cargo - Rp 18.000">Sicepat Cargo - Rp 18.000</option>
                    <option value="Kurir Toko (WZ Textile) - Rp 10.000">Kurir Toko (WZ Textile) - Rp 10.000</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Metode Pembayaran</label>
                  <select id="payment-selector" className="w-full p-2.5 bg-white border rounded-lg text-xs font-bold text-slate-800">
                    <option value="QRIS">QRIS Standar Nasional (GPN)</option>
                    <option value="Virtual Account (VA)">Mandiri/BCA Virtual Account</option>
                    <option value="COD">COD (Bayar di Tempat Caringin)</option>
                    <option value="PayLater">WZ PayLater Berbunga 0%</option>
                  </select>
                </div>

                {appliedVoucher && (
                  <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-100 flex items-center justify-between text-[11px] mb-2 animate-pulse">
                    <span className="flex items-center gap-1 font-bold">
                      <Percent className="w-3.5 h-3.5 text-emerald-600" />
                      Voucher Aktif: {appliedVoucher === "DISKON50" ? "Diskon 50%" : "Bebas Ongkir"}
                    </span>
                    <button
                      onClick={() => {
                        setAppliedVoucher(null);
                        triggerToast("Voucher dilepas.");
                      }}
                      className="text-emerald-900 underline hover:no-underline font-extrabold"
                    >
                      Batal
                    </button>
                  </div>
                )}

                <div className="space-y-1.5 border-t pt-3">
                  <div className="flex justify-between font-medium text-slate-500 text-[11px]">
                    <span>Subtotal Produk:</span>
                    <span>
                      {formatIDR(
                        cartDetails.reduce((sum, item) => {
                          const finalPrice = item.product.discount
                            ? item.product.price * (1 - item.product.discount / 100)
                            : item.product.price;
                          return sum + finalPrice * item.quantity;
                        }, 0)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between font-medium text-slate-500 text-[11px]">
                    <span>Ongkos Kirim:</span>
                    <span>
                      {appliedVoucher === "ONGKIRGRATIS" ? (
                        <span className="text-emerald-600 line-through">Rp 22.000</span>
                      ) : (
                        "Rp 22.000"
                      )}
                    </span>
                  </div>

                  {appliedVoucher === "DISKON50" && (
                    <div className="flex justify-between font-bold text-emerald-600 text-[11px]">
                      <span>Diskon Kilat 50%:</span>
                      <span>
                        -{formatIDR(
                          cartDetails.reduce((sum, item) => {
                            const finalPrice = item.product.discount
                              ? item.product.price * (1 - item.product.discount / 100)
                              : item.product.price;
                            return sum + finalPrice * item.quantity;
                          }, 0) * 0.5
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between font-black text-slate-900 text-xs border-t pt-2 mt-1">
                    <span>Estimasi Total:</span>
                    <span className="text-emerald-600 text-sm">
                      {formatIDR(
                        Math.max(0, 
                          cartDetails.reduce((sum, item) => {
                            const finalPrice = item.product.discount
                              ? item.product.price * (1 - item.product.discount / 100)
                              : item.product.price;
                            return sum + finalPrice * item.quantity;
                          }, 0) * (appliedVoucher === "DISKON50" ? 0.5 : 1) + 
                          (appliedVoucher === "ONGKIRGRATIS" ? 0 : 22000)
                        )
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const s = (document.getElementById("shipping-selector") as HTMLSelectElement).value;
                    const p = (document.getElementById("payment-selector") as HTMLSelectElement).value;
                    handleCheckout(s, p);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl uppercase tracking-wider text-xs transition-all shadow-md shadow-emerald-600/10"
                >
                  Bayar & Konfirmasi Instan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- PRODUCT DETAIL MODAL + GEMINI AI ASSISTANT BOX --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-900 text-xs uppercase font-mono tracking-wider">Spesifikasi Detail Produk</h3>
              <button onClick={() => setSelectedProduct(null)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Image & Main stats */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl bg-slate-50 border overflow-hidden">
                  <img src={selectedProduct.images[0]} className="w-full h-full object-cover" alt={selectedProduct.name} />
                </div>
                {selectedProduct.images.length > 1 && (
                  <div className="flex gap-2">
                    {selectedProduct.images.map((img, i) => (
                      <img key={i} src={img} className="w-14 h-14 object-cover rounded-lg border cursor-pointer hover:border-sky-500" alt="Sub Preview" />
                    ))}
                  </div>
                )}
                
                {/* Product Specifications Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border text-xs font-semibold text-slate-600 space-y-2">
                  <p className="font-bold text-slate-900 border-b pb-1">Spesifikasi Fisik & Logistik:</p>
                  <p>Kode SKU: <span className="font-mono text-slate-800">{selectedProduct.sku}</span></p>
                  <p>Berat Paket: <span className="text-slate-800">{selectedProduct.weight} gram</span></p>
                  <p>Dimensi Paket: <span className="text-slate-800">{selectedProduct.length} x {selectedProduct.width} x {selectedProduct.height} cm</span></p>
                  <p>Minimum Order: <span className="text-slate-800">{selectedProduct.minOrder} unit</span></p>
                </div>
              </div>

              {/* Purchase Details & Gemini AI tools */}
              <div className="space-y-5 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                    {selectedProduct.subcategory}
                  </span>
                  <h2 className="text-slate-900 font-black text-sm leading-tight">{selectedProduct.name}</h2>
                  <p className="text-slate-500 text-xs leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Seller Store Details */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-sky-100 flex items-center justify-center font-bold text-sky-800 border">
                      {selectedProduct.sellerName.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight">{selectedProduct.sellerName}</p>
                      <p className="text-[10px] text-slate-500">Rating Toko: ⭐ 4.9</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartChat(selectedProduct.sellerId, selectedProduct.sellerName)}
                    className="bg-sky-50 text-sky-600 hover:bg-sky-100 font-bold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat Penjual
                  </button>
                </div>

                {/* GEMINI AI ASSISTANT PANEL */}
                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-indigo-800 uppercase font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> Gemini AI Server-Side
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleAskGemini("seo-desc")}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] px-2 py-1 rounded"
                      >
                        Generate Deskripsi SEO
                      </button>
                      {selectedProduct.category === CategoryType.DAUR_ULANG && (
                        <button
                          onClick={() => handleAskGemini("barter")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] px-2 py-1 rounded"
                        >
                          Saran Daur Ulang/Barter
                        </button>
                      )}
                    </div>
                  </div>

                  {aiLoading ? (
                    <div className="text-[11px] font-mono text-slate-500 animate-pulse py-2">
                      Gemini sedang memikirkan strategi optimasi dan menulis deskripsi...
                    </div>
                  ) : aiResponseText ? (
                    <div className="bg-white p-3 rounded-xl border border-indigo-100 text-[10px] font-medium text-slate-700 max-h-32 overflow-y-auto leading-relaxed">
                      {aiResponseText}
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400">
                      Klik tombol di atas untuk menyuruh **Gemini 3.5 Flash** menyusun salinan deskripsi penjualan SEO secara cerdas dari metadata produk ini!
                    </p>
                  )}
                </div>

                {/* Purchase Button Block */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <button
                    onClick={() => handleAddToCart(selectedProduct)}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
                  >
                    + Keranjang
                  </button>
                  <button
                    onClick={() => handleInstantCheckout(selectedProduct)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Beli Instan (Kilat)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER & BRAND LEGAL INFORMATION */}
      <footer className="max-w-7xl mx-auto px-4 md:px-6 pt-12 pb-6 text-center text-slate-400 text-xs font-semibold space-y-3 border-t border-slate-200 mt-12">
        <div className="flex justify-center gap-6 text-slate-500">
          <a href="#about" className="hover:text-slate-800">Tentang Kami</a>
          <a href="#rules" className="hover:text-slate-800">Syarat Ketentuan</a>
          <a href="#guide" className="hover:text-slate-800">Panduan Kemitraan</a>
          <a href="#privacy" className="hover:text-slate-800">Kebijakan Privasi</a>
        </div>
        <p className="text-[11px] font-mono leading-relaxed">
          &copy; 2026 **WZ TEXTILE BY AHM ONLINE GROUP** - Garut, Jawa Barat.<br />
          Jl. Bandung - Rancabuaya - Caringin Garut | Owner: H. Aang Kurnia | CS WhatsApp: 085320200882
        </p>
        <p className="text-[9px] text-slate-300">
          Sistem Marketplace Enterprise Terdistribusi - Dirancang untuk 10 Juta Pengguna, 1 Juta Reseller, 50 Juta Produk.
        </p>
      </footer>

      {/* Floating Customer Support & Email Widget */}
      <FloatingContactWidget
        activeProfile={activeProfile}
        selectedProduct={selectedProduct}
        triggerToast={triggerToast}
      />
    </div>
  );
}
