/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CategoryType {
  UMKM = "UMKM",
  JASA = "JASA",
  BEKAS = "BEKAS",
  DAUR_ULANG = "DAUR_ULANG"
}

export enum ResellerLevel {
  SILVER = "Silver",
  GOLD = "Gold",
  PLATINUM = "Platinum",
  DIAMOND = "Diamond"
}

export type ProductCondition = "new" | "used" | "recycle";

export interface ProductVariation {
  name: string; // e.g., "Warna", "Ukuran"
  options: string[]; // e.g., ["Merah", "Biru"], ["S", "M", "L"]
}

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  subcategory: string;
  price: number;
  discount?: number; // percentage, e.g. 10
  rating: number;
  location: string;
  description: string;
  stock: number;
  sku: string;
  weight: number; // in grams
  length: number; // in cm
  width: number; // in cm
  height: number; // in cm
  minOrder: number;
  maxOrder: number;
  images: string[]; // Base64 or URLs
  videoUrl?: string;
  pdfUrl?: string;
  sellerId: string;
  sellerName: string;
  condition: ProductCondition;
  barterFor?: string; // Optional: specify items wanted for swap
  isFree?: boolean; // Optional: item is free/donation
  salesCount: number;
  createdAt: string;
}

export interface SellerStore {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  logo: string;
  banner: string;
  address: string;
  mapsCoords: { lat: number; lng: number };
  openHours: string; // e.g. "08:00 - 17:00"
  rating: number;
  followersCount: number;
  balance: number;
  level: ResellerLevel;
  referralCode: string;
  referredBy?: string;
  affiliateEarnings: number;
  monthlyBonus: number;
  isApproved: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariations: { [key: string]: string };
}

export type MessageType = "text" | "image" | "video" | "voice" | "location";

export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: MessageType;
  fileUrl?: string;
  duration?: number; // for voice note in seconds
  createdAt: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage?: string;
  unreadCount: number;
  isOnline?: boolean;
  isTyping?: boolean;
  createdAt: string;
}

export type OrderStatus = "Pending" | "Paid" | "Shipping" | "Completed" | "Cancelled";

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  items: {
    product: Product;
    quantity: number;
    selectedVariations: { [key: string]: string };
  }[];
  totalPrice: number;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  paymentStatus: "Unpaid" | "Paid" | "Refunded";
  status: OrderStatus;
  trackingNumber?: string;
  trackingLogs: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Buyer" | "Seller" | "Admin";
  balance: number;
  points: number;
  referralCode: string;
  joinedAt: string;
}

export interface AuditLog {
  id: string;
  username: string;
  role: string;
  action: string;
  ipAddress: string;
  timestamp: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

export interface BlogArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
}
