import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase } from "@/lib/cloudClient";
import { AuthForm } from "@/components/auth/AuthForm";
import { Logo } from "@/components/shared/Logo";
import authBackdrop from "@/assets/generated/hero-abstract.jpg";

const Auth = () => {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();

  useEffect(() => {
    if (!session) return;
    let active = true;

    const route = async () => {
      // Administrator accounts are provisioned separately and may only sign in
      // through the dedicated admin portal.
      const userId = session.user?.id;
      if (userId) {
        try {
          const { data: isAdmin } = await supabase.rpc("has_role", {
            _user_id: userId,
            _role: "admin",
          });
          if (!active) return;
          if (isAdmin) {
            await signOut();
            toast.error("Administrator accounts must sign in through the admin portal.");
            return;
          }
        } catch (e) {
          console.warn("Role check failed on sign-in:", e);
        }
      }

      if (!active) return;

      const pendingRedirect = sessionStorage.getItem("auth_redirect");
      if (pendingRedirect) {
        sessionStorage.removeItem("auth_redirect");
        navigate(pendingRedirect, { replace: true });
        return;
      }

      const hash = window.location.hash || "";
      const search = window.location.search || "";
      const isRecovery =
        hash.includes("type=recovery") ||
        hash.includes("access_token=") ||
        search.includes("type=recovery");
      if (isRecovery) {
        sessionStorage.setItem("open_password_reset", "true");
        navigate("/app/home#action=reset_password", { replace: true });
        return;
      }

      navigate("/app/home", { replace: true });
    };

    route();
    return () => {
      active = false;
    };
  }, [session, navigate, signOut]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-y-auto py-12 sm:py-16 px-4 text-foreground">
      {/* Immersive Crypto Background */}
      <div
        className="fixed inset-0 z-0 opacity-5 grayscale pointer-events-none"
        style={{
          backgroundImage: `url(${authBackdrop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-20 blur-[100px] dark:opacity-10"
          style={{
            background: `
              radial-gradient(circle at 15% 20%, var(--primary) 0%, transparent 40%),
              radial-gradient(circle at 85% 80%, var(--accent) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, var(--muted) 0%, transparent 60%)
            `,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-lg px-2 sm:px-6 flex flex-col items-center my-auto">
        {/* Logo and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Logo
            size={80}
            variant="SYMBOL"
            className="mb-4 mx-auto drop-shadow-[0_0_20px_hsl(var(--brand-primary)/0.35)] transition-transform hover:scale-105 duration-500"
          />
          <h2 className="text-foreground text-2xl font-light tracking-[0.4em] uppercase">
            Artesys
          </h2>
        </motion.div>

        {/* Ultra-Transparent Glassmorphic Modal Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full relative p-6 sm:p-10 md:p-14 rounded-[32px] sm:rounded-[48px] border border-border bg-card/40 backdrop-blur-[40px] shadow-[0_32px_128px_-32px_rgba(0,0,0,0.08)]"
        >
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 rounded-[32px] sm:rounded-[48px] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none dark:from-white/5" />

          <AuthForm isInsideModal={true} />
        </motion.div>

        {/* Action button helper for desktop landing return */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 0.9, y: -2 }}
          onClick={() => navigate("/")}
          className="mt-8 text-[10px] text-muted-foreground uppercase tracking-[0.3em] transition-all font-medium hover:text-foreground"
        >
          ← Return to Platform Overview
        </motion.button>
      </div>
    </div>
  );
};

export default Auth;
