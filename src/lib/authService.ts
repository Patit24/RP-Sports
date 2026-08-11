import { 
  signInWithPopup, 
  signInWithRedirect,
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
  redirecting?: boolean;
  error?: string;
}

/**
 * Perform Google Sign In / Sign Up using Firebase Popup forcing account selection
 * with automatic redirect fallback if popup is blocked by the browser.
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
    console.warn("Google Sign-In popup failed, checking for redirect fallback:", error.code || error.message);
    
    // Auto-fallback to redirect if popup is blocked, closed, or cancelled
    if (
      error.code === "auth/popup-blocked" || 
      error.code === "auth/popup-closed-by-user" || 
      error.code === "auth/cancelled-popup-request"
    ) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return {
          success: false,
          redirecting: true,
        };
      } catch (redirectError: any) {
        console.error("Google Sign-In redirect fallback failed:", redirectError);
        return {
          success: false,
          error: redirectError.message || "Google redirect sign-in failed.",
        };
      }
    }

    return {
      success: false,
      error: error.message || "Google sign-in was cancelled or failed.",
    };
  }
}

