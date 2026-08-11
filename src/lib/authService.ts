import { 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { saveUser } from "./firestoreService";

export interface AuthResult {
  success: boolean;
  email?: string;
  name?: string;
  photoURL?: string;
  uid?: string;
  error?: string;
}

/**
 * Perform Google Sign In / Sign Up using Firebase Popup forcing account selection
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    // Force Google account selection prompt on every login
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const name = user.displayName || user.email?.split("@")[0] || "RP Athlete";
    const email = user.email || `${user.uid}@google.com`;
    const photoURL = user.photoURL || undefined;

    // Save/update user profile in Firestore
    await saveUser(user.uid, {
      uid: user.uid,
      email,
      name,
      role: "customer",
    });

    return {
      success: true,
      email,
      name,
      photoURL,
      uid: user.uid,
    };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    return {
      success: false,
      error: error.message || "Google sign-in was cancelled or failed.",
    };
  }
}

