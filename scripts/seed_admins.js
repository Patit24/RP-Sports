const fs = require('fs');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0]?.trim();
    const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '$1');
    if (key) {
      process.env[key] = value;
    }
  });
}

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawKey = process.env.FIREBASE_PRIVATE_KEY;

if (!projectId || !clientEmail || !rawKey) {
  console.error("Missing Firebase Admin credentials in environment variables.");
  process.exit(1);
}

const privateKey = rawKey.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

initializeApp({
  credential: cert({
    projectId,
    clientEmail,
    privateKey,
  }),
});

const db = getFirestore();
const auth = getAuth();

const ADMIN_EMAILS = [
  "admin@rpsports.com",
  "superadmin@colortrade.app",
  "admin@colortrade.app",
  "patitroy29@gmail.com"
];

async function run() {
  console.log("Fetching all Firebase Auth users...");
  const listUsersResult = await auth.listUsers(1000);
  
  console.log(`Found ${listUsersResult.users.length} users in Auth.`);
  
  let count = 0;
  for (const userRecord of listUsersResult.users) {
    const email = userRecord.email?.toLowerCase().trim();
    const uid = userRecord.uid;
    
    // Check if user has an admin email, or if their email contains 'patit' or 'admin'
    const shouldBeAdmin = ADMIN_EMAILS.includes(email) || 
                          (email && (email.includes("patit") || email.includes("admin")));
                          
    if (shouldBeAdmin) {
      console.log(`Promoting user ${email} (${uid}) to admin/super_admin...`);
      
      const role = email.includes("superadmin") ? "super_admin" : "admin";
      
      // Update or create document in Firestore
      await db.collection("users").doc(uid).set({
        uid: uid,
        email: email,
        name: userRecord.displayName || email.split('@')[0],
        role: role,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      count++;
    }
  }
  
  console.log(`Successfully promoted ${count} user(s) to administrators in Firestore.`);
}

run().catch(console.error);
