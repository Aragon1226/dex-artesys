import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/cloudClient";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/lib/router-compat";
import { Logo } from "@/components/shared/Logo";
import { syncAdminPermissions } from "@/lib/adminPermissions";

/**
 * Dedicated admin portal sign-in.
 *
 * This screen is intentionally separate from the user app sign-in:
 *  - only accounts holding the `admin` role may complete sign-in here
 *  - no sign-up, no referral capture, no user-app navigation
 *  - a non-admin session is torn down immediately after verification fails
 *
 * The database `has_role()` check plus RLS remain the enforcement boundary;
 * this component is the portal's front door.
 */
const AdminLogin = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Already signed in as an admin? Go straight through.
  useEffect(() => {
    let active = true;
    const check = async () => {
      const userId = session?.user?.id;
      if (!userId) return;
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      if (!active) return;
      if (data) {
        const target = sessionStorage.getItem("admin_redirect") || "/admin/dashboard";
        sessionStorage.removeItem("admin_redirect");
        navigate(target, { replace: true });
      }
    };
    check();
    return () => {
      active = false;
    };
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !signInData.user) {
        toast.error(error?.message || "Invalid administrator credentials.");
        return;
      }

      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: signInData.user.id,
        _role: "admin",
      });

      if (!isAdmin) {
        await signOut();
        toast.error("This account is not authorized for the administrator portal.");
        return;
      }

      try {
        await syncAdminPermissions(signInData.user.email);
      } catch {
        // permission config is a UI nicety only
      }

      const target = sessionStorage.getItem("admin_redirect") || "/admin/dashboard";
      sessionStorage.removeItem("admin_redirect");
      toast.success("Administrator access granted.");
      navigate(target, { replace: true });
    } catch (err) {
      console.error("Admin sign-in failed", err);
      toast.error("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.18]">
        <div
          className="absolute inset-0 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, var(--primary) 0%, transparent 45%), radial-gradient(circle at 80% 75%, var(--accent) 0%, transparent 45%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Logo size={72} variant="SYMBOL" className="mx-auto mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <ShieldCheck size={12} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Administrator Portal
            </span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-7 shadow-xl space-y-5"
        >
          <div>
            <h1 className="text-xl font-black tracking-tight">Restricted access</h1>
            <p className="text-xs text-muted-foreground mt-1 font-medium">
              Administrator credentials only. Trader accounts cannot sign in here.
            </p>
          </div>

          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Admin email
            </span>
            <div className="mt-1.5 relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:border-primary transition-colors"
                placeholder="admin@artesys.com"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Password
            </span>
            <div className="mt-1.5 relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-background border border-border text-sm font-medium outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {loading ? "Verifying" : "Sign in to portal"}
          </button>

          <p className="text-[11px] text-muted-foreground text-center font-medium leading-relaxed">
            Access attempts are logged. Administrator accounts are provisioned by the platform owner
            and are not self-registerable.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
