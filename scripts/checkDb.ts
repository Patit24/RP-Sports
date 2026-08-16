import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function testRead() {
  try {
    console.log("Attempting client-side read of 'products' collection...");
    const snap = await getDocs(collection(db, "products"));
    console.log(`Successfully read ${snap.docs.length} products!`);
    snap.docs.forEach(doc => {
      console.log(`- ${doc.id}: ${doc.data().name}`);
    });
  } catch (err: any) {
    console.error("Read failed with error:", err.message);
  }
}

testRead();
