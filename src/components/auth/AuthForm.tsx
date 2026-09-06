import { useState, useEffect } from "react";
import { supabase } from "@/lib/cloudClient";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Mail, Lock, User, Loader2, FileText, X, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/shared/Logo";
import { WalletSignIn } from "@/components/auth/WalletSignIn";
import { isUserAdmin, syncAdminPermissions, getCustomAccounts, isPrimaryOwner } from "@/lib/adminPermissions";

// Step 1: Translate raw auth/network errors into friendly, actionable wording.
function describeAuthError(message: string): string {
  const msg = (message || "").toLowerCase();
  if (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("fetcherror") ||
    msg.includes("load failed")
  ) {
    return "Connection hiccup — please check your internet connection and try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please check your email and click the confirmation link before signing in.";
  }
  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again or reset your password.";
  }
  if (msg.includes("user already registered") || msg.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (msg.includes("password") && (msg.includes("weak") || msg.includes("at least") || msg.includes("too short"))) {
    return "That password is too weak — please use at least 6 characters with a mix of letters and numbers.";
  }
  if (msg.includes("pwned") || msg.includes("compromised") || msg.includes("breach")) {
    return "This password has appeared in a known data breach — please choose a different one.";
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts — please wait a minute and try again.";
  }
  if (msg.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  return message;
}

// Step 1: True only for transient transport failures worth retrying automatically.
function isTransientAuthError(message: string): boolean {
  const msg = (message || "").toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("networkerror") ||
    msg.includes("network request failed") ||
    msg.includes("fetcherror") ||
    msg.includes("load failed") ||
    msg.includes("timeout")
  );
}

interface AuthFormProps {
  onSuccess?: () => void;
  isInsideModal?: boolean;
}

export const AuthForm = ({ onSuccess, isInsideModal = false }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isUpdatePassword, setIsUpdatePassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const { toast } = useToast();

  const hostname = window.location.hostname;
  const isDomainAdmin = hostname === "admin.artesys.com" || hostname.startsWith("admin.");

  let envMode = "ALL";
  try {
    envMode = import.meta.env.VITE_APP_MODE;
  } catch (e) {
    // ignore
  }

  const appMode = isDomainAdmin ? "ADMIN" : (envMode || "ALL").toUpperCase();

  useEffect(() => {
    if (appMode === "ADMIN") {
      setIsLogin(true);
      setIsForgotPassword(false);
    }
  }, [appMode]);

  useEffect(() => {
    // Check if coming from a recovery link in the URL hash/query
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    if (hash.includes("type=recovery") || hash.includes("access_token=") || search.includes("type=recovery")) {
      setIsUpdatePassword(true);
    }

    const searchParams = new URLSearchParams(search);
    const urlRef = searchParams.get("ref");
    if (urlRef) {
      setIsLogin(false);
      setReferralCode(urlRef);
      localStorage.setItem("crypx_pending_ref_v1", urlRef);
    } else {
      const storedRef = localStorage.getItem("crypx_pending_ref_v1");
      if (storedRef) {
        setReferralCode(storedRef);
      }
    }

    // Subscribe to password recovery session events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsUpdatePassword(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        toast({
          title: "Google sign-in failed",
          description: result.error.message || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (result.redirected) return;

      toast({ title: "Welcome!", description: "Signed in with Google." });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Google sign-in failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAppleLoading(true);
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        toast({
          title: "Apple sign-in failed",
          description: result.error.message || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (result.redirected) return;

      toast({ title: "Welcome!", description: "Signed in with Apple." });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Apple sign-in failed",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setAppleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isForgotPassword && !isUpdatePassword && !agreedTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the Terms & Conditions to proceed.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (isUpdatePassword) {
        if (newPassword !== confirmNewPassword) {
          throw new Error("New passwords do not match.");
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;

        toast({ title: "Success!", description: "Your password has been reset successfully." });
        setIsUpdatePassword(false);
        setIsLogin(true);
        setNewPassword("");
        setConfirmNewPassword("");
      } else if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast({ title: "Email sent!", description: "Check your inbox for a password reset link." });
        setIsForgotPassword(false);
      } else if (isLogin) {
        const normEmail = email.toLowerCase().trim();

        // Check custom Admin & Staff accounts or primary owner password fallback
        const customAccounts = getCustomAccounts();
        const matchedCustom = customAccounts.find(
          (a) => a.email.toLowerCase().trim() === normEmail && a.password === password,
        );

        const isPrimary = isPrimaryOwner(normEmail);
        const isPrimaryMatched = isPrimary && password === "AungMoe$357";

        // Step 2: Try authenticating with real Supabase Auth first with retry logic
        let realAuthSuccess = false;
        let authErrorMsg: string | null = null;
        const MAX_ATTEMPTS = 3;
        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          try {
            const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
              email: normEmail,
              password: password,
            });

            if (!authErr && authData.session) {
              realAuthSuccess = true;
              authErrorMsg = null;
              // Clear any simulated session since we have a real one
              localStorage.removeItem("crypx_custom_session_v1");
              break;
            }
            if (authErr) {
              authErrorMsg = authErr.message;
              // Credential/validation errors should not be retried
              if (!/fetch|network|timeout|502|503|504/i.test(authErr.message)) break;
            }
          } catch (err: any) {
            authErrorMsg = err?.message || "Network error";
          }
          if (attempt < MAX_ATTEMPTS - 1) {
            await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt)));
          } else if (authErrorMsg && /fetch|network|timeout/i.test(authErrorMsg)) {
            authErrorMsg = "Couldn't reach the server. Check your connection and try again.";
          }
        }

        if (realAuthSuccess) {
          if (appMode === "ADMIN") {
            const syncedIsAdmin = await syncAdminPermissions(normEmail);
            if (!syncedIsAdmin && !isUserAdmin(normEmail)) {
              await supabase.auth.signOut();
              throw new Error("Unauthorized: Admin access only");
            }
          }
          toast({ title: "Welcome back!", description: "You have been logged in successfully." });
          onSuccess?.();
          return;
        } else if (matchedCustom || isPrimaryMatched) {
          try {
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email: normEmail,
              password: password,
              options: {
                data: {
                  display_name: matchedCustom ? matchedCustom.username : "Platform Owner",
                  username: matchedCustom ? matchedCustom.username : "Owner",
                  custom_id: matchedCustom ? matchedCustom.customId : "OWNER",
                  role: matchedCustom ? matchedCustom.role : "owner",
                },
              },
            });

            if (!signUpErr && signUpData.session) {
              localStorage.removeItem("crypx_custom_session_v1");
              toast({ title: "Welcome!", description: "Account synchronized and logged in." });
              onSuccess?.();
              return;
            } else if (signUpErr && signUpErr.message.toLowerCase().includes("already registered")) {
              throw new Error(
                "This admin email is already registered on the platform. Please use your original password you signed up with, or register a different admin email in the portal.",
              );
            } else if (signUpErr) {
              throw signUpErr;
            }
          } catch (e: any) {
            console.warn("Seamless signup failed", e);
            toast({
              title: "Authentication Failed",
              description: e.message || "Failed to synchronize admin account.",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Error",
            description: "Could not establish a secure database session. Please check your credentials.",
            variant: "destructive",
          });
          return;
        } else {
          throw new Error(authErrorMsg || "Invalid login credentials");
        }
      } else {
        if (referralCode.trim()) {
          localStorage.setItem("crypx_pending_ref_v1", referralCode.trim());
        }

        // Step 3: Replace the sign-up block with retry optimization
        const normEmail = email.toLowerCase().trim();
        const MAX_ATTEMPTS = 3;
        let signUpError: string | null = null;
        let created = false;

        for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
          try {
            const { error } = await supabase.auth.signUp({
              email: normEmail,
              password,
              options: {
                data: {
                  display_name: displayName || "Crypto Trader",
                  referral_code: referralCode.trim() || undefined,
                },
                emailRedirectTo: `${window.location.origin}/auth`,
              },
            });

            if (!error) {
              created = true;
              signUpError = null;
              break;
            }

            signUpError = describeAuthError(error.message);
            // Only transient transport failures are worth retrying
            if (!isTransientAuthError(error.message)) break;
          } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Network error";
            signUpError = describeAuthError(message);
            if (!isTransientAuthError(message)) break;
          }

          if (attempt < MAX_ATTEMPTS - 1) {
            await new Promise((r) => setTimeout(r, 600 * Math.pow(2, attempt)));
          }
        }

        if (!created) throw new Error(signUpError || "We couldn't create your account. Please try again.");

        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account before signing in.",
        });
        onSuccess?.();
      }
      // Step 4: Final customized catch error processing block
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      const failTitle = isUpdatePassword
        ? "Couldn't update password"
        : isForgotPassword
          ? "Couldn't send reset email"
          : isLogin
            ? "Sign-in failed"
            : "Sign-up couldn't be completed";
      toast({ title: failTitle, description: describeAuthError(message), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const title = isUpdatePassword
    ? "Set New Password"
    : isForgotPassword
      ? "Reset Password"
      : isLogin
        ? "Welcome Back"
        : "Create Account";

  const subtitle = isUpdatePassword
    ? "Enter and confirm your new secure password"
    : isForgotPassword
      ? "Enter your email to receive a reset link"
      : isLogin
        ? "Sign in to access your dashboard"
        : "Join Artesys and start trading";

  const glassInputClasses =
    "w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all backdrop-blur-sm";

  return (
    <div className={`w-full ${isInsideModal ? "" : "max-w-md"}`}>
      <div className="relative z-10 w-full mb-8">
        {!isInsideModal && (
          <div className="flex justify-center mb-12">
            <Logo size={80} variant="SYMBOL" className="drop-shadow-[0_0_20px_hsl(var(--brand-primary)/0.35)]" />
          </div>
        )}

        <h1 className="text-3xl font-bold text-center mb-3 text-foreground tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground text-center mb-10 font-medium font-sans animate-pulse">
          {subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isUpdatePassword ? (
            <>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={glassInputClasses}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className={glassInputClasses}
                  required
                  minLength={6}
                />
              </div>
            </>
          ) : (
            <>
              {!isLogin && !isForgotPassword && (
                // Step 5: Updated Display Name input wrapper with requirement guidelines
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder="Display Name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={glassInputClasses}
                    required
                    aria-required="true"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground pl-1">
                    Required — this is the name shown on your account.
                  </p>
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={glassInputClasses}
                  required
                />
              </div>

              {!isForgotPassword && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={glassInputClasses}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {isLogin && !isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-primary hover:underline transition-colors font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </>
          )}

          {!isForgotPassword && !isUpdatePassword && (
            <div className="flex items-start gap-2.5 my-3 px-1 text-xs">
              <input
                type="checkbox"
                id="auth-terms-checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded accent-primary border-border cursor-pointer shrink-0"
              />
              <label
                htmlFor="auth-terms-checkbox"
                className="text-muted-foreground cursor-pointer select-none leading-tight"
              >
                I do AGREE the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-primary font-bold hover:underline"
                >
                  terms & conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-primary font-bold hover:underline"
                >
                  disclaimer
                </button>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_hsl(var(--brand-primary)/0.35)] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading
              ? "Processing..."
              : isUpdatePassword
                ? "Update Password"
                : isForgotPassword
                  ? "Send Reset Link"
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
          </button>
        </form>

        {appMode !== "ADMIN" && !isForgotPassword && !isUpdatePassword && (
          <div className="mt-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || loading}
              className="w-full py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-muted active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A8.99 8.99 0 0 0 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.28-1.72V4.94H.96A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.96 4.06l3.01-2.34z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.59C13.46.89 11.43 0 9 0A8.99 8.99 0 0 0 .96 4.94l3 2.34C4.68 5.16 6.66 3.58 9 3.58z"
                  />
                </svg>
              )}
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <button
              type="button"
              onClick={handleAppleSignIn}
              disabled={appleLoading || loading}
              className="w-full py-4 rounded-2xl bg-card border border-border text-foreground font-semibold hover:bg-muted active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-3"
            >
              {appleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="currentColor">
                  <path d="M12.55 5.48c-.04.02-.08.03-.12.03-.62 0-1.13-.5-1.13-1.13 0-.62.5-1.13 1.13-1.13.04 0 .08.01.12.02-.42.28-.7.76-.7 1.3 0 .34.12.66.32.91h.38z" />
                  <path d="M15.18 12.47c-.27 1.04-.99 1.96-1.93 2.49-.47.25-1 .39-1.55.39-.22 0-.44-.02-.65-.07-.6-.13-1.18-.13-1.77 0-.21.05-.43.07-.65.07-.55 0-1.08-.14-1.55-.39-.94-.53-1.66-1.45-1.93-2.49-.13-.5-.18-1.02-.13-1.54.08-.86.41-1.66.95-2.3.6-.71 1.43-1.13 2.32-1.17.28-.01.56.04.83.15.4.16.82.24 1.24.24s.84-.08 1.24-.24c.27-.11.55-.16.83-.15.89.04 1.72.46 2.32 1.17.54.64.87 1.44.95 2.3.05.52 0 1.04-.13 1.54zM11.7 2.5c.04.96-.68 1.84-1.63 1.94-.04 0-.09.01-.13.01-.05 0-.09-.01-.14-.01h-.01c-.02 0-.04-.01-.06-.01-.02 0-.04.01-.06.01h-.01c-.04 0-.09-.01-.13-.01-.95-.1-1.67-.98-1.63-1.94.04-.91.78-1.67 1.69-1.73.02 0 .04-.01.06-.01.02 0 .04.01.06.01h.01c.04 0 .09-.01.13-.01.04 0 .09.01.13.01h.01c.02 0 .04-.01.06-.01.02 0 .04.01.06.01.91.06 1.65.82 1.69 1.73z" />
                </svg>
              )}
              {appleLoading ? "Connecting..." : "Continue with Apple"}
            </button>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.25em] mb-3 font-semibold">
                Web3 sign-in
              </p>
              <WalletSignIn onSuccess={onSuccess} disabled={loading} />
            </div>
          </div>
        )}

        {/* Modal for Terms & Conditions and Educational Disclaimers */}
        {showTermsModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-card w-full max-w-lg rounded-[32px] max-h-[85vh] flex flex-col shadow-2xl border border-border animate-scale-in text-left">
              <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary" size={24} />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Terms & Conditions</h3>
                    <p className="text-xs text-muted-foreground">Educational & Demo Platform Agreement</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs sm:text-sm text-muted-foreground leading-relaxed custom-scrollbar">
                <div className="p-4 rounded-2xl bg-warning/10 border border-warning/20 text-warning">
                  <div className="flex items-center gap-2 font-bold text-warning mb-1">
                    <AlertTriangle size={16} /> Educational Demo Trading Notice
                  </div>
                  <p className="text-xs text-warning/90 leading-relaxed">
                    Artesys is strictly an educational demo trading simulator. It does not provide real financial
                    services, real asset deposits, live money withdrawals, or financial advice. All balances are paper
                    credits.
                  </p>
                </div>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-foreground text-sm">1. Non-Financial Purpose & Educational Scope</h4>
                  <p>
                    This platform is built for software testing, educational evaluation, and demo trading practice in
                    Web3 mechanics. No real fiat or cryptocurrency transactions occur on this platform.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-foreground text-sm">2. Complete Exemption of Developer Liability</h4>
                  <p>
                    By signing up or logging in, the user agrees that the development teams, individual developers,
                    software authors, and platform operators shall bear ZERO legal liability or financial responsibility
                    for any user actions or decisions.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-foreground text-sm">3. Transparent Platform Capabilities</h4>
                  <p>
                    Spot trading, futures leverage, staking yield, identity verification, and asset portfolio tracking
                    are simulated software features designed to teach users trading mechanics safely.
                  </p>
                </section>

                <section className="space-y-1.5">
                  <h4 className="font-bold text-foreground text-sm">4. Privacy & Compliance</h4>
                  <p>
                    User account data is stored securely using encrypted database connections for session state
                    management. We do not sell user data or engage in predatory practices.
                  </p>
                </section>
              </div>

              <div className="p-4 border-t border-border flex justify-end shrink-0">
                <button
                  onClick={() => {
                    setAgreedTerms(true);
                    setShowTermsModal(false);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-brand-sm"
                >
                  I Understand & Agree
                </button>
              </div>
            </div>
          </div>
        )}

        {isUpdatePassword ? (
          <p className="text-center text-sm text-muted-foreground mt-8">
            <button onClick={() => setIsUpdatePassword(false)} className="text-primary font-bold hover:underline">
              Cancel Reset
            </button>
          </p>
        ) : isForgotPassword ? (
          <div className="space-y-4 mt-8">
            <p className="text-center text-sm text-muted-foreground">
              <button onClick={() => setIsForgotPassword(false)} className="text-primary font-bold hover:underline">
                Back to Sign In
              </button>
            </p>
          </div>
        ) : !isDomainAdmin ? (
          <p className="text-center text-sm mt-8">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold hover:underline">
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
};
