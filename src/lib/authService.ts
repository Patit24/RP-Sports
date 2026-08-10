import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { saveUser } from "./firestoreService";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

/**
 * Perform Google Sign In / Sign Up using Firebase Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const name = user.displayName || user.email?.split("@")[0] || "RP Athlete";
    const email = user.email || `${user.uid}@google.com`;
    const photoURL = user.photoURL || undefined;

    // Non-blocking Firestore save
    saveUser(email, {
      email,
      name,
      role: "customer",
      addresses: [],
      rewardPoints: 100,
    }).catch(err => console.warn("Firestore save user warning:", err));

    return {
      success: true,
      email,
      name,
      photoURL,
      uid: user.uid,
      error: undefined,
    };
  } catch (error: any) {
    console.warn("Google Sign-In Notice:", error.code || error.message);
    let msg = error.message || "Failed to sign in with Google.";
    if (error.code === "auth/operation-not-allowed") {
      msg = "Google Authentication is not enabled in Firebase Console. Please enable Google in Firebase Console -> Auth -> Sign-in method.";
    } else if (error.code === "auth/unauthorized-domain") {
      const hostname = typeof window !== "undefined" ? window.location.hostname : "your custom domain";
      msg = `Domain '${hostname}' is not authorized in Firebase. Add '${hostname}' in Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
    }
    return {
      success: false,
      error: msg
    };
  }
}

/**
 * Initialize Recaptcha Verifier safely without re-rendering errors
 */
export function setupRecaptcha(containerId: string = "recaptcha-container") {
  if (typeof window === "undefined") return null;

  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Recaptcha container #${containerId} not found in DOM.`);
      return null;
    }

    // Reuse existing verifier if already instantiated
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    // Clear any stale child nodes inside the container to prevent re-render error
    if (container.children.length > 0) {
      container.innerHTML = "";
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {
        window.recaptchaVerifier = undefined;
      }
    });

    return window.recaptchaVerifier;
  } catch (err: any) {
    console.warn("Recaptcha setup warning:", err.message);
    return null;
  }
}

/**
 * Send REAL-TIME 6-digit SMS OTP code to Phone Number (+91) via Firebase Phone Auth
 */
export async function sendPhoneOTP(phoneNumber: string, containerId: string = "recaptcha-container") {
  try {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      return {
        success: false,
        error: "Please enter a valid 10-digit Indian phone number."
      };
    }

    const formattedPhone = `+91${cleanPhone}`;
    let appVerifier = setupRecaptcha(containerId);
    
    if (!appVerifier) {
      return {
        success: false,
        error: "Recaptcha verification container not ready. Please refresh the page."
      };
    }

    try {
      // Dispatch real SMS via Firebase Phone Auth API
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;

      return { 
        success: true, 
        message: `Real SMS OTP code sent to ${formattedPhone}` 
      };
    } catch (innerErr: any) {
      // If recaptcha element was already rendered or expired, clear and retry once
      if (String(innerErr).includes("reCAPTCHA has already been rendered") || innerErr.code === "auth/captcha-check-failed") {
        if (window.recaptchaVerifier) {
          try { window.recaptchaVerifier.clear(); } catch (e) {}
          window.recaptchaVerifier = undefined;
        }
        const freshContainer = document.getElementById(containerId);
        if (freshContainer) freshContainer.innerHTML = "";
        
        const freshVerifier = setupRecaptcha(containerId);
        if (freshVerifier) {
          const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, freshVerifier);
          window.confirmationResult = confirmationResult;
          return {
            success: true,
            message: `Real SMS OTP code sent to ${formattedPhone}`
          };
        }
      }
      throw innerErr;
    }

  } catch (error: any) {
    console.warn("Firebase Phone Auth Notice:", error.code || error.message);
    
    // Clear verifier state on error
    if (window.recaptchaVerifier) {
      try { window.recaptchaVerifier.clear(); } catch (e) {}
      window.recaptchaVerifier = undefined;
    }

    const hostname = typeof window !== "undefined" ? window.location.hostname : "your domain";
    let userFriendlyMsg = error.message || "Failed to send SMS OTP.";

    if (error.code === "auth/unauthorized-domain" || String(error).includes("unauthorized domain")) {
      userFriendlyMsg = `Domain '${hostname}' is not authorized in Firebase. Please add '${hostname}' in Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
    } else if (
      error.code === "auth/operation-not-allowed" || 
      String(error).includes("SMS unable to be sent until this region enabled")
    ) {
      userFriendlyMsg = "SMS to India (+91) is restricted in Firebase Console. Please enable Phone & SMS Region Policy (India) in Firebase Console -> Authentication -> Settings.";
    } else if (error.code === "auth/invalid-phone-number") {
      userFriendlyMsg = "The phone number format is invalid. Please enter a valid 10-digit number.";
    } else if (error.code === "auth/quota-exceeded") {
      userFriendlyMsg = "SMS quota exceeded for today. Please try again later.";
    } else if (error.code === "auth/captcha-check-failed") {
      userFriendlyMsg = "reCAPTCHA verification failed. Please try again.";
    }

    return {
      success: false,
      error: userFriendlyMsg
    };
  }
}

/**
 * Verify REAL-TIME 6-Digit SMS OTP Code with Firebase ONLY (Strict Verification)
 */
export async function verifyPhoneOTP(otpCode: string, phoneNumber: string) {
  try {
    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      return {
        success: false,
        error: "OTP code must be exactly 6 digits."
      };
    }

    if (!window.confirmationResult) {
      return {
        success: false,
        error: "OTP session not initialized or expired. Please click 'Send 6-Digit OTP Code' first."
      };
    }

    // STRICT Firebase Confirmation — verifies actual SMS code received on user's mobile phone
    const result = await window.confirmationResult.confirm(otpCode);
    const user = result.user;
    const phone = user.phoneNumber || phoneNumber;
    const cleanPhone = phone.replace(/\D/g, "");
    const name = `Athlete (${cleanPhone.slice(-4)})`;
    const email = `${cleanPhone}@rpsports.in`;

    // Asynchronously save profile to Cloud Firestore
    saveUser(email, {
      email,
      name,
      role: "customer",
      addresses: [],
      rewardPoints: 50,
    }).catch(err => console.warn("Firestore save user warning:", err));

    return {
      success: true,
      email,
      name,
      phone: cleanPhone,
      uid: user.uid
    };
  } catch (error: any) {
    console.warn("Strict OTP Verification Notice:", error.code || error.message);

    let errorMsg = "Invalid 6-digit OTP code. Please check your mobile SMS and try again.";
    if (error.code === "auth/invalid-verification-code") {
      errorMsg = "Incorrect OTP code. The code you entered does not match the SMS sent to your phone.";
    } else if (error.code === "auth/code-expired") {
      errorMsg = "The OTP code has expired. Please click 'Resend OTP Code' to receive a new SMS.";
    }

    return {
      success: false,
      error: errorMsg
    };
  }
}
