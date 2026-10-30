"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { api, storeAuth } from "../lib/api";
import "@/app/signup.css";

export default function Login() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);

  const getSafeNext = () => {
    if (typeof window === "undefined") return "/Dashboard/home";
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) return next;
    return "/Dashboard/home";
  };

  const redirectAfterAuth = async () => {
    try {
      await api.onboarding();
      router.replace(getSafeNext());
    } catch (onboardingError) {
      if (onboardingError?.status === 404) {
        router.replace("/onboarding");
        return;
      }
      throw onboardingError;
    }
  };

  const form = useForm({
    defaultValues: { identifier: "", password: "", code: "" },
    onSubmit: async ({ value }) => {
      setError("");
      setLoading(true);

      try {
        if (mfaChallenge) {
          if (value.code.trim().length !== 6) {
            setError("Enter the 6-digit authentication code.");
            return;
          }
          const tokens = await api.verifyMfa({
            challenge_token: mfaChallenge,
            code: value.code.trim(),
          });
          storeAuth(tokens);
          await redirectAfterAuth();
          return;
        }

        const response = await api.login({
          username: value.identifier.trim(),
          password: value.password,
        });

        if (response?.challenge_token && !response?.access_token) {
          setMfaChallenge(response.challenge_token);
          return;
        }

        storeAuth(response);
        await redirectAfterAuth();
      } catch (err) {
        setError(err?.message || "Unable to sign in. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <main className="signup-page relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfaf4] p-6">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/signup-background.png')" }}
      />

      <div className="relative z-10 w-full max-w-[420px] rounded-3xl bg-[#072540] p-8 shadow-2xl sm:p-10">
        <h1 className="mb-8 text-3xl font-extrabold text-white">
          <span className="text-[#009450]">V</span>uka
        </h1>

        <h2 className="text-2xl font-bold text-white">
          {mfaChallenge ? "Verify your sign in" : "Welcome back"}
        </h2>
        <p className="mt-2 mb-8 text-sm text-blue-200">
          {mfaChallenge
            ? "Enter the 6-digit code from your authenticator app."
            : "Sign in to continue your journey."}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {!mfaChallenge ? (
            <>
              <form.Field name="identifier">
                {(field) => (
                  <label className="group block">
                    <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                      Email or username
                    </span>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="joselyne@example.com"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                    />
                  </label>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <label className="group block">
                    <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                      Password
                    </span>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pr-12 pl-4 text-sm text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-4 -translate-y-1/2 text-blue-200/50 transition-colors hover:text-[#009450]"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </label>
                )}
              </form.Field>
            </>
          ) : (
            <form.Field name="code">
              {(field) => (
                <label className="group block">
                  <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                    Authentication code
                  </span>
                  <input
                    inputMode="numeric"
                    maxLength={6}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    placeholder="123456"
                    autoComplete="one-time-code"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-center text-lg font-bold tracking-[0.5em] text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  />
                </label>
              )}
            </form.Field>
          )}

          {error && <p className="text-sm font-medium text-red-400">{error}</p>}

          {!mfaChallenge && (
            <p className="text-sm text-blue-200">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#009450] transition-colors hover:text-white"
              >
                Sign up
              </Link>
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#009450] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#00b864] hover:shadow-[#009450]/25 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Processing...
                </>
              ) : mfaChallenge ? (
                "Verify code"
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          {mfaChallenge && (
            <button
              type="button"
              onClick={() => {
                setMfaChallenge(null);
                setError("");
              }}
              className="w-full text-center text-sm font-medium text-blue-200 transition-colors hover:text-white"
            >
              Use another sign in method
            </button>
          )}
        </form>
      </div>
    </main>
  );
}
