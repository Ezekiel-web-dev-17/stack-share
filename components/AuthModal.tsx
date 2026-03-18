"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/* ─── Types ──────────────────────────────────────────────── */
type Tab = "login" | "register";

interface AuthResponse {
  data?: {
    user?: { id: string; name: string; email: string; role: string };
    accessToken?: string;
    refreshToken?: string;
  };
  message?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Animation variants ─────────────────────────────────── */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.94, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 24,
    transition: { duration: 0.25, ease: "easeIn" as const },
  },
};

/* ─── Component ──────────────────────────────────────────── */
export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // — Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // — Register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // reset state when modal closes / tab changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [tab, isOpen]);

  /* ── Login handler ─────────────────────────────────────── */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data: AuthResponse = await res.json();

      if (!res.ok) {
        setError(data.message ?? "Login failed. Please try again.");
        return;
      }

      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      if (data.data?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }

      setSuccess("Welcome back! You are now logged in.");
      setTimeout(onClose, 1200);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  /* ── Register handler ──────────────────────────────────── */
  // The backend accepts an optional `role` field: "ADMIN" | "USER"

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const role = isAdmin ? "ADMIN" : "USER";

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          password: regPassword,
          role,
        }),
      });

      const data: AuthResponse = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      if (data.data?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }

      setSuccess(
        isAdmin
          ? "Admin account created successfully!"
          : "Account created! Welcome to StackShare.",
      );
      setTimeout(onClose, 1200);
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ─────────────────────────────────── */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* ── Modal ────────────────────────────────────── */}
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="modal"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              className="pointer-events-auto w-full max-w-md rounded-2xl border border-[#1e293b] bg-surface shadow-2xl"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(14,165,233,0.08), 0 25px 50px rgba(0,0,0,0.6), 0 0 80px rgba(14,165,233,0.06)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* — Header ───────────────────────────────── */}
              <div className="relative flex items-center justify-between border-b border-[#1e293b] px-6 py-5">
                <div>
                  <h2
                    id="auth-modal-title"
                    className="text-lg font-bold text-white"
                  >
                    {tab === "login" ? "Welcome back" : "Join StackShare"}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted">
                    {tab === "login"
                      ? "Sign in to your account"
                      : "Create a new account"}
                  </p>
                </div>

                <button
                  id="auth-modal-close"
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[#1e293b] hover:text-white"
                  aria-label="Close modal"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M2 2l12 12M14 2L2 14" />
                  </svg>
                </button>
              </div>

              {/* — Tab switcher ─────────────────────────── */}
              <div className="flex gap-1 px-6 pt-5">
                {(["login", "register"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    id={`auth-tab-${t}`}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`relative flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 cursor-pointer ${
                      tab === t
                        ? "bg-primary/10 text-primary"
                        : "text-muted hover:text-white"
                    }`}
                  >
                    {t === "login" ? "Sign In" : "Sign Up"}
                    {tab === t && (
                      <motion.span
                        layoutId="tab-indicator"
                        className="absolute inset-0 rounded-lg border border-primary/30"
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* — Body ─────────────────────────────────── */}
              <div className="px-6 pb-6 pt-4">
                <AnimatePresence mode="wait">
                  {tab === "login" ? (
                    <motion.form
                      key="login-form"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleLogin}
                      className="space-y-4"
                      noValidate
                    >
                      {/* Email */}
                      <FormField
                        id="login-email"
                        label="Email address"
                        type="email"
                        value={loginEmail}
                        onChange={setLoginEmail}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                      {/* Password */}
                      <FormField
                        id="login-password"
                        label="Password"
                        type="password"
                        value={loginPassword}
                        onChange={setLoginPassword}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                      />

                      <StatusBanner error={error} success={success} />

                      <SubmitButton loading={isLoading} label="Sign In" />
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register-form"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleRegister}
                      className="space-y-4"
                      noValidate
                    >
                      {/* Name */}
                      <FormField
                        id="reg-name"
                        label="Username"
                        type="text"
                        value={regName}
                        onChange={setRegName}
                        placeholder="Your name"
                        autoComplete="name"
                        required
                      />
                      {/* Email */}
                      <FormField
                        id="reg-email"
                        label="Email address"
                        type="email"
                        value={regEmail}
                        onChange={setRegEmail}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                      />
                      {/* Password */}
                      <FormField
                        id="reg-password"
                        label="Password"
                        type="password"
                        value={regPassword}
                        onChange={setRegPassword}
                        placeholder="Min. 8 chars, uppercase & number"
                        autoComplete="new-password"
                        required
                      />

                      {/* ── Admin toggle ─────────────────── */}
                      <button
                        id="admin-toggle"
                        type="button"
                        onClick={() => setIsAdmin((p) => !p)}
                        aria-expanded={isAdmin}
                        className="flex w-full items-center justify-between rounded-lg border border-dashed border-[#1e293b] px-3 py-2 text-xs transition-colors hover:border-accent-purple/40 hover:bg-accent-purple/5 cursor-pointer"
                      >
                        <span className="flex items-center gap-2 text-[#475569]">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          Register as admin
                        </span>
                        {/* toggle pill */}
                        <span
                          className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ${
                            isAdmin ? "bg-accent-purple" : "bg-[#1e293b]"
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform duration-200 ${
                              isAdmin
                                ? "translate-x-3.5"
                                : "translate-x-0.5"
                            }`}
                          />
                        </span>
                      </button>

                      <StatusBanner error={error} success={success} />

                      <SubmitButton
                        loading={isLoading}
                        label="Create Account"
                      />
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* ── Footer note ──────────────────────── */}
                <p className="mt-4 text-center text-xs text-[#475569]">
                  {tab === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        id="switch-to-register"
                        type="button"
                        onClick={() => setTab("register")}
                        className="text-primary transition-opacity hover:opacity-80"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        id="switch-to-login"
                        type="button"
                        onClick={() => setTab("login")}
                        className="text-primary transition-opacity hover:opacity-80"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Sub-components ─────────────────────────────────────── */

function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
  labelExtra,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  labelExtra?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="block text-xs font-medium text-muted">
          {label}
        </label>
        {labelExtra}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-lg border border-[#1e293b] bg-background px-3.5 py-2.5 text-sm text-white placeholder-border-light outline-none ring-0 transition-all duration-200 focus:border-primary/60 focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function StatusBanner({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (!error && !success) return null;
  return (
    <AnimatePresence>
      {(error || success) && (
        <motion.div
          key={error ? "error" : "success"}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`rounded-lg border px-3.5 py-2.5 text-xs ${
            error
              ? "border-accent-red/30 bg-accent-red/10 text-accent-red"
              : "border-accent-green/30 bg-accent-green/10 text-accent-green"
          }`}
        >
          {error ?? success}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      id="auth-submit-btn"
      type="submit"
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className="relative w-full overflow-hidden rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          Loading…
        </span>
      ) : (
        label
      )}
    </motion.button>
  );
}
