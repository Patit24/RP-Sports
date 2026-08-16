import { create } from "zustand";
import { persist } from "zustand/middleware";
import { 
  saveOrder, 
  saveUser, 
  saveWishlist, 
  updateStockInDB, 
  addProductToDB, 
  updateProductInDB, 
  deleteProductFromDB, 
  updateOrderStatusInDB,
  Category,
  TestimonialVideo
} from "./firestoreService";
import { notifyDeliveryPartner } from "./deliveryPartnerService";
import { mockProducts, Product } from "./mockData";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export type { Product } from "./mockData";

export interface CustomFieldOption {
  name: string;
  price: number;
}

export interface CustomJerseyDesign {
  jerseyNumber: string;
  playerName: string;
  fontStyle: string;
  numberColor: string;
  textColor: string;
  sleeveLogo?: string;
  chestSponsor?: string;
  teamName?: string;
  playerNumber?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  customJersey?: CustomJerseyDesign;
  customTrophy?: {
    material: string;
    size: string;
    engravingText: string;
  };
}

export interface DeliveryPartnerInfo {
  carrier: string;
  awbNumber: string;
  hub: string;
  status: "Pickup Requested" | "Package Picked Up" | "In Transit" | "Out for Delivery" | "Delivered";
  dispatchedAt: string;
  estimatedDeliveryDate: string;
  agentPhone?: string;
  dispatchMessage?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: "UPI" | "Razorpay" | "Card" | "Wallet" | "Net Banking" | "COD";
  paymentStatus: "Pending" | "Success" | "Failed";
  status: "Pending" | "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";
  total: number;
  createdAt: string;
  trackingNumber?: string;
  deliveryPartnerInfo?: DeliveryPartnerInfo;

  // Real Shiprocket parameters
  shiprocket_order_id?: string | number;
  shiprocket_shipment_id?: string | number;
  shiprocket_channel_order_id?: string | number;
  awb_code?: string;
  courier_name?: string;
  shipping_status?: string;
  pickup_status?: string;
  tracking_url?: string;
  pickup_scheduled_at?: string;
  shipped_at?: string;
  delivered_at?: string;
  shiprocket_status?: string;
  userEmail?: string;
  subtotal?: number;
  discount?: number;
  deliveryFee?: number;
  tax?: number;
  freeDelivery?: boolean;
  currency?: string;
}

export interface User {
  uid?: string;
  name: string;
  email: string;
  role: "admin" | "customer" | "super_admin";
  permissions?: string[];
  addresses: Order["shippingAddress"][];
  rewardPoints: number;
}

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "info" | "error";
}

export interface Coupon {
  id?: string;
  code: string;
  description: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountPercent: number;
  appliesTo?: "all" | "specific";
  productIds?: string[];
  minimumOrderValue?: number;
  maximumDiscount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usageCount?: number;
  usagePerCustomer?: number;
  active?: boolean;
}

export const VALID_COUPONS: Coupon[] = [
  {
    code: "KOLKATA10",
    discountPercent: 10,
    discountType: "percentage",
    discountValue: 10,
    appliesTo: "all",
    description: "10% OFF on all sports gear",
  },
  {
    code: "RPBAT20",
    discountPercent: 20,
    discountType: "percentage",
    discountValue: 20,
    appliesTo: "specific",
    productIds: ["rp-001", "rp-002", "rp-7070", "rp-premium-bat", "rp-kashmir-350", "rp-english-pro"],
    minimumOrderValue: 1500,
    maximumDiscount: 2000,
    description: "20% OFF on Kashmir & English Willow Cricket Bats",
  },
  {
    code: "WELCOME500",
    discountPercent: 15,
    discountType: "fixed",
    discountValue: 500,
    appliesTo: "all",
    minimumOrderValue: 2000,
    description: "₹500 Flat OFF for new club members",
  },
];

interface SportsStoreState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  orders: Order[];
  currentUser: User | null;
  quickViewProduct: Product | null;
  toast: ToastMessage | null;
  activeCoupon: Coupon | null;
  categories: Category[];
  testimonials: TestimonialVideo[];
  
  // Actions
  login: (email: string, name: string, role?: "admin" | "customer" | "super_admin", permissions?: string[], uid?: string) => void;
  logout: () => void;
  
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  clearCompare: () => void;
  
  setQuickView: (product: Product | null) => void;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  clearToast: () => void;
  
  applyCoupon: (code: string, couponData?: Partial<Coupon>) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  placeOrder: (
    address: Order["shippingAddress"],
    paymentMethod: Order["paymentMethod"],
    paymentStatus: Order["paymentStatus"]
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  setOrders: (orders: Order[]) => void;
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setTestimonials: (testimonials: TestimonialVideo[]) => void;
  
  // Admin Product CRUD
  addProduct: (product: Omit<Product, "id" | "slug" | "sku">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateInventoryStock: (productId: string, qty: number) => void;
}

export const useStore = create<SportsStoreState>()(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      wishlist: [],
      compareList: [],
      orders: [],
      currentUser: null,
      quickViewProduct: null,
      toast: null,
      activeCoupon: null,
      categories: [],
      testimonials: [],

      showToast: (message, type = "success") => {
        set({ toast: { id: Date.now().toString(), message, type } });
      },

      clearToast: () => set({ toast: null }),

      setQuickView: (product) => set({ quickViewProduct: product }),

      applyCoupon: (code, couponData) => {
        if (couponData) {
          const discountPercent = couponData.discountType === "percentage"
            ? (couponData.discountValue || 0)
            : (couponData.discountPercent || 0);

          const fullCoupon: Coupon = {
            code: couponData.code || code.trim().toUpperCase(),
            description: couponData.description || `${couponData.discountValue}${couponData.discountType === "fixed" ? "₹" : "%"} OFF`,
            discountType: couponData.discountType || "percentage",
            discountValue: couponData.discountValue || discountPercent,
            discountPercent,
            appliesTo: couponData.appliesTo || "all",
            productIds: couponData.productIds,
            minimumOrderValue: couponData.minimumOrderValue,
            maximumDiscount: couponData.maximumDiscount,
            startDate: couponData.startDate,
            expiryDate: couponData.expiryDate,
            usageLimit: couponData.usageLimit,
            usageCount: couponData.usageCount,
            usagePerCustomer: couponData.usagePerCustomer,
            active: couponData.active !== false,
          };
          set({ activeCoupon: fullCoupon });
          get().showToast(`Coupon '${fullCoupon.code}' applied!`, "success");
          return { success: true, message: `Applied coupon ${fullCoupon.code}` };
        }

        const found = VALID_COUPONS.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        );
        if (found) {
          set({ activeCoupon: found });
          get().showToast(`Coupon '${found.code}' applied! (${found.discountPercent}% OFF)`, "success");
          return { success: true, message: `Applied ${found.discountPercent}% discount.` };
        }
        return { success: false, message: "Invalid coupon code." };
      },

      removeCoupon: () => {
        set({ activeCoupon: null });
        get().showToast("Coupon removed", "info");
      },

      login: (email, name, role = "customer", permissions = [], uid) => {
        const userDocId = uid || email.toLowerCase().replace(/[.#$[\]]/g, "_");
        const userData: User = {
          uid: userDocId,
          name,
          email,
          role,
          permissions,
          addresses: [
            {
              fullName: name,
              phone: "+91 98765 43210",
              addressLine: "Flat 405, Carbon Towers, Sports City Road",
              city: "Kolkata",
              state: "West Bengal",
              pincode: "700028",
            },
          ],
          rewardPoints: 120,
        };
        set({ currentUser: userData });
        get().showToast(`Welcome back, ${name}!`, "success");
        // Sync user profile to Firestore (non-blocking)
        saveUser(userDocId, userData).catch(console.error);
      },

      logout: () => {
        if (typeof window !== "undefined") {
          signOut(auth).catch(console.error);
        }
        set({ currentUser: null, cart: [] });
        get().showToast("Signed out successfully", "info");
      },

      addToCart: (newItem) => {
        const productStock = newItem.product.stock ?? 10;
        if (productStock <= 0) {
          get().showToast(`Sorry, ${newItem.product.name} is currently out of stock.`, "error");
          return;
        }

        const hash = [
          newItem.product.id,
          newItem.selectedColor || "",
          newItem.selectedSize || "",
          newItem.customJersey ? JSON.stringify(newItem.customJersey) : "",
          newItem.customTrophy ? JSON.stringify(newItem.customTrophy) : "",
        ].join("-");

        const cart = get().cart;
        const existingIdx = cart.findIndex((item) => item.id === hash);

        if (existingIdx > -1) {
          const currentQty = cart[existingIdx].quantity;
          const maxAllowed = Math.min(productStock, currentQty + newItem.quantity);
          if (currentQty >= productStock) {
            get().showToast(`Maximum available stock (${productStock}) already in cart.`, "info");
            return;
          }
          const updatedCart = [...cart];
          updatedCart[existingIdx].quantity = maxAllowed;
          set({ cart: updatedCart });
        } else {
          const initialQty = Math.min(productStock, newItem.quantity);
          set({ cart: [...cart, { ...newItem, quantity: initialQty, id: hash }] });
        }
        get().showToast(`Added ${newItem.product.name} to cart!`, "success");
      },

      removeFromCart: (cartItemId) => {
        set({ cart: get().cart.filter((item) => item.id !== cartItemId) });
        get().showToast("Item removed from cart", "info");
      },

      updateCartQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(cartItemId);
          return;
        }
        const cartItem = get().cart.find((c) => c.id === cartItemId);
        const maxStock = cartItem?.product?.stock ?? 99;
        const clampedQty = Math.min(maxStock, quantity);

        set({
          cart: get().cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity: clampedQty } : item
          ),
        });
      },

      toggleWishlist: (productId) => {
        const wishlist = get().wishlist;
        const user = get().currentUser;
        const prod = get().products.find((p) => p.id === productId);
        const exists = wishlist.includes(productId);
        const next = exists
          ? wishlist.filter((id) => id !== productId)
          : [...wishlist, productId];
        set({ wishlist: next });

        if (prod) {
          get().showToast(
            exists ? `Removed ${prod.name} from wishlist` : `Added ${prod.name} to wishlist!`,
            exists ? "info" : "success"
          );
        }

        const wishlistId = user?.uid || (user?.email ? user.email.toLowerCase().replace(/[.#$[\]]/g, "_") : null);
        if (wishlistId) {
          saveWishlist(wishlistId, next).catch(console.error);
        }
      },

      toggleCompare: (productId) => {
        const compareList = get().compareList;
        const prod = get().products.find((p) => p.id === productId);
        const exists = compareList.includes(productId);
        
        if (!exists && compareList.length >= 4) {
          get().showToast("You can compare up to 4 bats at a time.", "error");
          return;
        }

        const next = exists
          ? compareList.filter((id) => id !== productId)
          : [...compareList, productId];
        
        set({ compareList: next });

        if (prod) {
          get().showToast(
            exists ? `Removed ${prod.name} from compare` : `Added ${prod.name} to compare!`,
            exists ? "info" : "success"
          );
        }
      },

      clearCompare: () => {
        set({ compareList: [] });
        get().showToast("Cleared comparison list", "info");
      },

      clearCart: () => set({ cart: [] }),

      placeOrder: (address, paymentMethod, paymentStatus) => {
        const cart = get().cart;
        if (cart.length === 0) return null;

        const totalInclusive = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        const subtotalExcludingGst = Math.round(totalInclusive / 1.18);
        const tax = totalInclusive - subtotalExcludingGst;
        const shipping = totalInclusive >= 999 ? 0 : 250;
        const discountPercent = get().activeCoupon ? get().activeCoupon!.discountPercent : 0;
        const couponDiscount = Math.round((totalInclusive * discountPercent) / 100);
        const grandTotal = totalInclusive + shipping - couponDiscount;

        const orderId = "ORD-" + Date.now().toString(36) + Math.floor(Math.random() * 10000);
        const isKolkataLocal = address.pincode.startsWith("700");
        const carrierName = isKolkataLocal ? "Delhivery Express" : "Blue Dart Logistics";
        const awbNumber = `${isKolkataLocal ? 'DLH' : 'BLD'}-KOL-${Math.floor(100000 + Math.random() * 900000)}`;

        const estDate = new Date();
        estDate.setDate(estDate.getDate() + (isKolkataLocal ? 2 : 4));
        const estimatedDeliveryDate = estDate.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        const deliveryPartnerInfo: DeliveryPartnerInfo = {
          carrier: carrierName,
          awbNumber,
          hub: isKolkataLocal ? "Kolkata Central Hub, Dumdum (700028)" : "Kolkata Airport Logistics Park",
          status: "Pickup Requested",
          dispatchedAt: new Date().toISOString(),
          estimatedDeliveryDate,
          agentPhone: isKolkataLocal ? "+91 98300 12345" : "+91 98311 54321",
          dispatchMessage: `Delivery partner '${carrierName}' notified for order pickup. AWB: ${awbNumber}`,
        };

        const newOrder: Order = {
          id: orderId,
          items: [...cart],
          shippingAddress: address,
          paymentMethod,
          paymentStatus,
          status: "Confirmed",
          subtotal: subtotalExcludingGst,
          discount: couponDiscount,
          deliveryFee: shipping,
          tax: tax,
          freeDelivery: totalInclusive >= 999,
          currency: "INR",
          total: grandTotal,
          createdAt: new Date().toISOString(),
          trackingNumber: awbNumber,
          deliveryPartnerInfo,
        };

        // Deduct inventory stock
        const products = get().products;
        const updatedProducts = products.map((prod) => {
          const cartItem = cart.find((c) => c.product.id === prod.id);
          if (cartItem) {
            const nextStock = Math.max(0, prod.stock - cartItem.quantity);
            // Sync updated stock to Firestore DB
            updateStockInDB(prod.id, nextStock).catch(console.error);
            return { ...prod, stock: nextStock };
          }
          return prod;
        });

        const userEmail = get().currentUser?.email || address.phone || "guest@rpsports.in";

        set({
          orders: [newOrder, ...get().orders],
          products: updatedProducts,
          cart: [], // Clear cart on success
          activeCoupon: null, // Clear coupon after checkout
        });

        // Save Order to Cloud Firestore Database
        saveOrder(newOrder, userEmail).catch((err) =>
          console.warn("Firestore saveOrder notice:", err)
        );

        // Trigger Real Shiprocket Order Sync securely on payment success or COD
        if (paymentStatus === "Success" || paymentMethod === "COD") {
          fetch("/api/shiprocket/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder),
          })
            .then(async (res) => {
              const data = await res.json();
              if (data.success) {
                console.log("🚀 Shiprocket Order synced on checkout:", data);
              } else {
                console.warn("⚠️ Shiprocket Order sync failed/pending:", data.message);
              }
            })
            .catch((err) => {
              console.error("❌ Shiprocket Order checkout sync error:", err);
            });
        }

        // Trigger Delivery Partner Dispatch Notification & Firestore Sync
        notifyDeliveryPartner(newOrder).catch((err) =>
          console.warn("Delivery partner dispatch notice:", err)
        );

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        const order = get().orders.find((ord) => ord.id === orderId || (ord as any).firestoreId === orderId);
        set({
          orders: get().orders.map((ord) =>
            ord.id === orderId || (ord as any).firestoreId === orderId ? { ...ord, status } : ord
          ),
        });
        // Sync status update to Cloud Firestore using the direct docId if found
        const docId = order ? ((order as any).firestoreId || order.id) : orderId;
        updateOrderStatusInDB(docId, status).catch(console.error);
      },

      setOrders: (orders) => {
        set({ orders });
      },

      setProducts: (products) => {
        set({ products });
      },

      setCategories: (categories) => {
        set({ categories });
      },

      setTestimonials: (testimonials) => {
        set({ testimonials });
      },

      addProduct: (prodData) => {
        const id = "rp-" + Date.now().toString().slice(-4);
        const slug = prodData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const sku = "RP-" + Math.floor(1000 + Math.random() * 9000);
        const newProd: Product = {
          ...prodData,
          id,
          slug,
          sku,
          image: prodData.image || prodData.images?.[0] || "/cricket_bat_studio.jpg",
          gallery: prodData.gallery || prodData.images || ["/cricket_bat_studio.jpg"],
          originalPrice: prodData.originalPrice || prodData.mrp || prodData.price,
          reviewCount: prodData.reviewCount || prodData.reviewsCount || 1,
          specs: prodData.specs || prodData.specifications || {},
        };
        set({ products: [newProd, ...get().products] });
        get().showToast(`Product '${prodData.name}' added successfully!`, "success");

        // Sync new product to Cloud Firestore Database
        addProductToDB(newProd).catch((err) =>
          console.warn("Firestore addProductToDB notice:", err)
        );
      },

      updateProduct: (updatedProd) => {
        set({
          products: get().products.map((p) => (p.id === updatedProd.id ? updatedProd : p)),
        });
        get().showToast(`Updated product '${updatedProd.name}'`, "success");

        // Sync updated product to Cloud Firestore Database
        updateProductInDB(updatedProd).catch((err) =>
          console.warn("Firestore updateProductInDB notice:", err)
        );
      },

      deleteProduct: (productId) => {
        set({
          products: get().products.filter((p) => p.id !== productId),
        });
        get().showToast("Product deleted from store catalog", "info");

        // Sync deleted product to Cloud Firestore Database
        deleteProductFromDB(productId).catch((err) =>
          console.warn("Firestore deleteProductFromDB notice:", err)
        );
      },

      updateInventoryStock: (productId, qty) => {
        set({
          products: get().products.map((prod) =>
            prod.id === productId ? { ...prod, stock: qty } : prod
          ),
        });
        // Sync to Firestore
        updateStockInDB(productId, qty).catch(console.error);
      },
    }),
    {
      name: "rp-sports-store",
      version: 8,
      migrate: (persistedState: any, version: number) => {
        if (version < 8) {
          return {
            ...persistedState,
            products: [],
            categories: [],
            testimonials: [],
            orders: [],
            cart: [],
            wishlist: []
          };
        }
        return persistedState;
      },
    }
  )
);
