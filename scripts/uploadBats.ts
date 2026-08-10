import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { mockProducts } from "../src/lib/mockData";

const firebaseConfig = {
  apiKey: "AIzaSyANQ3H4WNGxsbcNDSLCRUoCH0wl_zgU4CY",
  authDomain: "rpsports-data.firebaseapp.com",
  projectId: "rpsports-data",
  storageBucket: "rpsports-data.firebasestorage.app",
  messagingSenderId: "212466668507",
  appId: "1:212466668507:web:95eda401514d63524d4dfe",
  measurementId: "G-HP0KNXB2MS",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadBats() {
  console.log("🔥 Connecting to Firestore project: rpsports-data");
  
  // 1. Clear existing products in Firestore
  const snap = await getDocs(collection(db, "products"));
  console.log(`Found ${snap.docs.length} existing products in Firestore.`);
  
  for (const document of snap.docs) {
    console.log(`Deleting old product doc ID: ${document.id}`);
    await deleteDoc(doc(db, "products", document.id));
  }
  
  // 2. Upload bat products
  console.log(`Uploading ${mockProducts.length} bat products to Firestore...`);
  for (const product of mockProducts) {
    await setDoc(doc(db, "products", product.id), {
      ...product,
      updatedAt: serverTimestamp(),
    });
    console.log(`  ✓ Uploaded bat: ${product.name} (ID: ${product.id})`);
  }
  
  console.log("🎉 Successfully uploaded all bats to Firestore!");
  process.exit(0);
}

uploadBats().catch((err) => {
  console.error("❌ Error uploading bats:", err);
  process.exit(1);
});
