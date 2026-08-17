import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { NEW_CATALOG_PRODUCTS } from "../src/lib/newCatalogProducts";

const firebaseConfig = {
  apiKey: "AIzaSyANQ3H4WNGxsbcNDSLCRUoCH0wl_zgU4CY",
  authDomain: "rpsports-data.firebaseapp.com",
  projectId: "rpsports-data",
  storageBucket: "rpsports-data.firebasestorage.app",
  messagingSenderId: "212466668507",
  appId: "1:212466668507:web:95eda401514d63524d4dfe",
  measurementId: "G-HP0KNXB2MS",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function runSeed() {
  console.log(`🚀 Starting Firestore upload for ${NEW_CATALOG_PRODUCTS.length} new out-of-stock catalog products...`);
  
  let successCount = 0;
  for (const product of NEW_CATALOG_PRODUCTS) {
    try {
      // Clean undefined fields if any
      const cleanedProduct = JSON.parse(JSON.stringify(product));
      await setDoc(doc(db, "products", product.id), {
        ...cleanedProduct,
        stock: 0, // Authoritative initial stock: 0
        updatedAt: serverTimestamp(),
      }, { merge: true });
      successCount++;
      console.log(`✓ [${successCount}/${NEW_CATALOG_PRODUCTS.length}] Uploaded: ${product.name} (SKU: ${product.sku}, Stock: 0)`);
    } catch (err: any) {
      console.error(`✗ Error uploading ${product.id}:`, err.message);
    }
  }

  console.log(`\n🎉 Successfully uploaded ${successCount} products to Firestore with stock = 0.`);
  
  // Verify by reading back from Firestore
  const snap = await getDocs(collection(db, "products"));
  console.log(`📊 Total products in Firestore 'products' collection: ${snap.size}`);
  
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("Fatal seed error:", err);
  process.exit(1);
});
