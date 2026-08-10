import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, mockProducts } from "./mockData";
import {
  saveUser,
  saveOrder,
  saveWishlist,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
  updateStockInDB,
} from "./firestoreService";


export interface CartItem {
  id: string; // unique key combining product.id + size + color + customHash
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  customJersey?: {
    teamName: string;
    playerName: string;
    playerNumber: string;
    primaryColor: string;
    secondaryColor: string;
    sponsorLogo?: string;
    jerseyStyle: string;
  };
  customTrophy?: {
    material: string;
    size: string;
    engravingText: string;
  };
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
}

export interface User {
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
  code: string;
  discountPercent: number;
  description: string;
}

export const VALID_COUPONS: Coupon[] = [
  { code: "KOLKATA10", discountPercent: 10, description: "10% OFF on all sports gear" },
  { code: "RPBAT20", discountPercent: 20, description: "20% OFF on Kashmir & English Willow Cricket Bats" },
  { code: "WELCOME500", discountPercent: 15, description: "15% OFF for new store members" },
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
  
  // Actions
  login: (email: string, name: string, role?: "admin" | "customer" | "super_admin", permissions?: string[]) => void;
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
  
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  placeOrder: (
    address: Order["shippingAddress"],
    paymentMethod: Order["paymentMethod"],
    paymentStatus: Order["paymentStatus"]
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  
  // Admin Product CRUD
  addProduct: (product: Omit<Product, "id" | "slug" | "sku">) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  updateInventoryStock: (productId: string, qty: number) => void;
}


export const useStore = create<SportsStoreState>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      cart: [],
      wishlist: [],
      compareList: [],
      orders: [],
      currentUser: null,
      quickViewProduct: null,
      toast: null,
      activeCoupon: null,

      showToast: (message, type = "success") => {
        set({ toast: { id: Date.now().toString(), message, type } });
      },

      clearToast: () => set({ toast: null }),

      setQuickView: (product) => set({ quickViewProduct: product }),

      applyCoupon: (code) => {
        const found = VALID_COUPONS.find(
          (c) => c.code.toUpperCase() === code.trim().toUpperCase()
        );
        if (found) {
          set({ activeCoupon: found });
          get().showToast(`Coupon '${found.code}' applied! (${found.discountPercent}% OFF)`, "success");
          return { success: true, message: `Applied ${found.discountPercent}% discount.` };
        }
        return { success: false, message: "Invalid coupon code. Try 'KOLKATA10' or 'RPBAT20'." };
      },

      removeCoupon: () => {
        set({ activeCoupon: null });
        get().showToast("Coupon removed", "info");
      },

      login: (email, name, role = "customer", permissions = []) => {
        const userData: User = {
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
        saveUser(email, userData).catch(console.error);
      },

      logout: () => {
        set({ currentUser: null, cart: [] });
        get().showToast("Signed out successfully", "info");
      },

      addToCart: (newItem) => {
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
          const updatedCart = [...cart];
          updatedCart[existingIdx].quantity += newItem.quantity;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...cart, { ...newItem, id: hash }] });
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
        set({
          cart: get().cart.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
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

        if (user?.email) {
          saveWishlist(user.email, next).catch(console.error);
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

        const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        const tax = Math.round(subtotal * 0.18); // 18% GST
        const shipping = subtotal > 5000 ? 0 : 250;
        const grandTotal = subtotal + tax + shipping;

        const newOrder: Order = {
          id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
          items: [...cart],
          shippingAddress: address,
          paymentMethod,
          paymentStatus,
          status: "Pending",
          total: grandTotal,
          createdAt: new Date().toISOString(),
          trackingNumber: "TRK" + Math.floor(100000000 + Math.random() * 900000000),
        };

        // Deduct inventory stock
        const products = get().products;
        const updatedProducts = products.map((prod) => {
          const cartItem = cart.find((c) => c.product.id === prod.id);
          if (cartItem) {
            const nextStock = Math.max(0, prod.stock - cartItem.quantity);
            return { ...prod, stock: nextStock };
          }
          return prod;
        });

        set({
          orders: [newOrder, ...get().orders],
          products: updatedProducts,
          cart: [], // Clear cart on success
        });

        // Persist order to Firestore (non-blocking)
        const user = get().currentUser;
        saveOrder(newOrder, user?.email).catch(console.error);

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((ord) =>
            ord.id === orderId ? { ...ord, status } : ord
          ),
        });
      },

      addProduct: (newProd) => {
        const currentProducts = get().products;
        const id = Date.now().toString();
        const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const sku = `RP-PROD-${Math.floor(100000 + Math.random() * 900000)}`;
        const product = { ...newProd, id, slug, sku };
        set({ products: [...currentProducts, product] });
        // Sync to Firestore
        addProductToDB(product).catch(console.error);
      },

      updateProduct: (updatedProd) => {
        set({
          products: get().products.map((prod) =>
            prod.id === updatedProd.id ? updatedProd : prod
          ),
        });
        // Sync to Firestore
        updateProductInDB(updatedProd).catch(console.error);
      },

      deleteProduct: (productId) => {
        set({
          products: get().products.filter((prod) => prod.id !== productId),
        });
        // Sync to Firestore
        deleteProductFromDB(productId).catch(console.error);
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
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (version < 4) {
          return {
            ...persistedState,
            products: mockProducts,
          };
        }
        return persistedState;
      },
    }
  )
);
