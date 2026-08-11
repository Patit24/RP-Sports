"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, AlertCircle, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { signInWithGooglePopup, checkGoogleRedirectResult } from "@/lib/authService";
import { onAuthStateChanged, createUserWithEmailAndPassword, updateProfile, signInWithRedirect } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { saveUser, addSubscriber } from "@/lib/firestoreService";

export default function SignUpPage() {
  const router = useRouter();
  const { currentUser, login, showToast } = useStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser, router]);

  useEffect(() => {
    // Check for Google OIDC redirect result on mount
    checkGoogleRedirectResult().then(async (res) => {
      if (res && res.success && res.email) {
        setLoading(true);
        try {
          const name = res.name || form.name || res.email.split("@")[0] || "RP Athlete";
          
          await saveUser(res.uid!, {
            uid: res.uid,
            email: res.email!,
            name,
            role: "customer",
            addresses: [],
            rewardPoints: 100,
          });

          login(res.email, name, "customer", [], res.uid);
          addSubscriber(res.email).catch(console.error);

          showToast(`Welcome to RP Sports, ${name}!`, "success");
          router.push("/");
        } catch (err) {
          console.error("Error setting up user profile on redirect return:", err);
          login(res.email, res.name || "RP Athlete", "customer", [], res.uid);
          router.push("/");
        } finally {
          setLoading(false);
        }
      } else if (res && res.error) {
        setErrors({ google: res.error });
      }
    }).catch((err) => console.error("Error checking redirect result:", err));

    // Real-time Firebase Auth listener for Google OAuth / email signup tokens
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email) {
        const name = user.displayName || form.name || user.email.split("@")[0] || "RP Athlete";
        
        setLoading(true);
        try {
          // Sync profile to Firestore
          await saveUser(user.uid, {
            uid: user.uid,
            email: user.email!,
            name,
            role: "customer",
            addresses: [],
            rewardPoints: 100,
          });

          // Sync local state session
          login(user.email, name, "customer", [], user.uid);
          addSubscriber(user.email).catch(console.error);

          showToast(`Welcome to RP Sports, ${name}!`, "success");
          router.push("/");
        } catch (err: any) {
          console.error("Error setting up user profile:", err);
          login(user.email, name, "customer", [], user.uid);
          router.push("/");
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [login, showToast, router, form.name]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (score <= 1) return { level: score, label: "Weak", color: "#CC0000" };
    if (score === 2) return { level: score, label: "Fair", color: "#FF6B00" };
    if (score === 3) return { level: score, label: "Good", color: "#F59E0B" };
    return { level: score, label: "Strong", color: "#22C55E" };
  };

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Full name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email.";
    if (!form.password) newErrors.password = "Password is required.";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!form.agreeTerms) newErrors.agreeTerms = "You must agree to the terms to continue.";
    return newErrors;
  };

  // Google OAuth Sign Up
  const handleGoogleSignUp = () => {
    setLoading(true);
    setErrors({});

    signInWithGooglePopup()
      .then(async (result) => {
        const user = result.user;
        const name = user.displayName || form.name || user.email?.split("@")[0] || "RP Athlete";
        const email = user.email || `${user.uid}@google.com`;

        // Sync profile to Firestore
        await saveUser(user.uid, {
          uid: user.uid,
          email,
          name,
          role: "customer",
          addresses: [],
          rewardPoints: 100,
        });

        // Sync local state session
        login(email, name, "customer", [], user.uid);
        addSubscriber(email).catch(console.error);

        showToast(`Welcome to RP Sports, ${name}!`, "success");
        router.push("/");
      })
      .catch((err: any) => {
        setLoading(false);
        // Fallback to Redirect mode if browser settings strictly block popups
        if (
          err.code === "auth/popup-blocked" || 
          err.code === "auth/cancelled-popup-request"
        ) {
          setErrors({ google: "Popup blocked. Redirecting to Google secure signup..." });
          signInWithRedirect(auth, googleProvider).catch((redirErr) => {
            console.error("Google redirect fallback error:", redirErr);
            setErrors({ google: redirErr.message || "Google redirect failed." });
          });
        } else {
          console.error("Google popup sign-up failed:", err);
          setErrors({ google: err.message || "Google Sign-Up failed." });
        }
      });
  };

  // Main Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase Auth
      const creds = await createUserWithEmailAndPassword(auth, form.email, form.password);
      
      // Set display name in Firebase Auth
      await updateProfile(creds.user, {
        displayName: form.name
      });
      
      // Firestore profile sync is triggered by onAuthStateChanged listener
    } catch (err: any) {
      console.error("Sign-up error:", err);
      let errMsg = "Failed to create account. Please try again.";
      const fieldErrors: Record<string, string> = {};
      
      if (err.code === "auth/email-already-in-use") {
        fieldErrors.email = "This email address is already in use.";
      } else if (err.code === "auth/invalid-email") {
        fieldErrors.email = "Invalid email format.";
      } else if (err.code === "auth/weak-password") {
        fieldErrors.password = "Password is too weak. Choose a stronger password.";
      } else {
        errMsg = err.message || errMsg;
        setErrors({ form: errMsg });
      }
      
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F9F9]">
      {/* Left Panel: Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#111111]">
        <img
          src="/hero-banner.jpg"
          alt="RP Sports Athlete"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/60 to-[#CC0000]/40" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <span className="font-display font-black text-3xl text-white uppercase tracking-tight">
              RP <span className="text-[#CC0000]">SPORTS</span>
            </span>
          </Link>

          {/* Center Text */}
          <div>
            <div className="w-12 h-1 bg-[#CC0000] mb-8" />
            <h2
              className="text-4xl xl:text-5xl font-display font-black uppercase text-white tracking-tight leading-tight mb-4"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              JOIN THE <br />
              <span className="text-[#CC0000]">ATHLETE NETWORK</span>
            </h2>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed font-medium">
              Create an account for faster checkout, order tracking, exclusive gear drops, and member rewards.
            </p>
          </div>

          {/* Features bullet list */}
          <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#CC0000]" /> 100% Genuine Handcrafted Willow Bats
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#CC0000]" /> Express Pan-India Courier Delivery
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#CC0000]" /> Machine Knocking & Oiling Services Included
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 pt-28 md:pt-32">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-2 bg-[#CC0000]/10 border border-[#CC0000]/30 px-3 py-1 rounded-full mb-3">
              <UserPlus className="w-3.5 h-3.5 text-[#CC0000]" />
              <span className="text-[#CC0000] font-display font-bold uppercase tracking-widest text-xs" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                New Member Registration
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-black uppercase text-[#111111] tracking-tight" style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
              Create Athlete Account
            </h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1 font-medium">
              Already registered?{" "}
              <Link href="/signin" className="text-[#CC0000] font-bold hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>

          {/* Errors */}
          {(errors.google || errors.form) && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-left">
              <AlertCircle className="w-4 h-4 text-[#CC0000] flex-shrink-0" />
              <p className="text-xs text-[#CC0000] font-bold">{errors.google || errors.form}</p>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 h-12 border border-gray-300 bg-white text-xs font-display font-bold uppercase tracking-wider text-gray-700 hover:text-[#CC0000] hover:border-[#CC0000] transition-all rounded-xl cursor-pointer shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#F9F9F9] px-4 text-gray-400 font-mono tracking-widest">
                Or Register With Details
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1 text-left">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Raj Paswan"
                className={`w-full h-11 px-4 border bg-white text-[#111111] font-medium text-sm rounded-xl focus:outline-none transition-colors ${
                  errors.name ? "border-[#CC0000]" : "border-gray-300 focus:border-[#CC0000]"
                }`}
                required
              />
              {errors.name && <p className="text-xs text-[#CC0000] font-bold mt-1 text-left">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1 text-left">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full h-11 px-4 border bg-white text-[#111111] font-medium text-sm rounded-xl focus:outline-none transition-colors ${
                  errors.email ? "border-[#CC0000]" : "border-gray-300 focus:border-[#CC0000]"
                }`}
                required
              />
              {errors.email && <p className="text-xs text-[#CC0000] font-bold mt-1 text-left">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1 text-left">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`w-full h-11 pl-4 pr-11 border bg-white text-[#111111] font-medium text-sm rounded-xl focus:outline-none transition-colors ${
                    errors.password ? "border-[#CC0000]" : "border-gray-300 focus:border-[#CC0000]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-[#CC0000] font-bold mt-1 text-left">{errors.password}</p>}

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2 space-y-1 text-left">
                  <div className="flex gap-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${(strength.level / 4) * 100}%`,
                        backgroundColor: strength.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Strength: <span style={{ color: strength.color }}>{strength.label}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-gray-700 mb-1 text-left">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full h-11 pl-4 pr-11 border bg-white text-[#111111] font-medium text-sm rounded-xl focus:outline-none transition-colors ${
                    errors.confirmPassword ? "border-[#CC0000]" : "border-gray-300 focus:border-[#CC0000]"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-[#CC0000] font-bold mt-1 text-left">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="text-left pt-1">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 accent-[#CC0000] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-gray-600 font-medium">
                  I agree to RP Sports'{" "}
                  <Link href="/terms" className="text-[#CC0000] font-bold hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" className="text-[#CC0000] font-bold hover:underline">
                    Privacy Policy
                  </Link>.
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-[#CC0000] font-bold mt-1">{errors.agreeTerms}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 font-display font-bold uppercase tracking-widest text-sm rounded-xl shadow-lg shadow-[#CC0000]/30 hover:scale-[1.01] transition-transform disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating Account..." : "Create Athlete Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
