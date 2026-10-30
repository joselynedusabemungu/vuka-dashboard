"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { api, storeAuth } from "../lib/api";

export default function Signup() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError("");
      setLoading(true);
      try {
        await api.register({
          email: value.email.trim(),
          username: value.username.trim(),
          password: value.password,
          first_name: value.firstName.trim(),
          last_name: value.lastName.trim(),
        });

        const loginResponse = await api.login({
          username: value.username.trim(),
          password: value.password,
        });

        storeAuth(loginResponse);
        router.replace("/onboarding");
      } catch (err) {
        setError(err?.message || "Could not create your account.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fbfaf4] p-6">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('/images/signup-background.png')" }}
      />

      <div className="relative z-10 w-full max-w-[480px] rounded-3xl bg-[#072540] p-8 shadow-2xl sm:p-10">
        <h1 className="mb-8 text-3xl font-extrabold text-white">
          <span className="text-[#009450]">V</span>uka
        </h1>

        <h2 className="text-2xl font-bold text-white">Create your account</h2>
        <p className="mt-2 mb-8 text-sm text-blue-200">
          Let's get to know you.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <form.Field name="firstName">
              {(field) => (
                <label className="group block">
                  <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                    First name
                  </span>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all outline-none focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="lastName">
              {(field) => (
                <label className="group block">
                  <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                    Last name
                  </span>
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all outline-none focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  />
                </label>
              )}
            </form.Field>
          </div>

          <form.Field name="username">
            {(field) => (
              <label className="group block">
                <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                  Username
                </span>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all outline-none focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                />
              </label>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <label className="group block">
                <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                  Email address
                </span>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white backdrop-blur-sm transition-all outline-none focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
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
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-12 pl-4 text-sm text-white backdrop-blur-sm transition-all outline-none focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-blue-200/50 transition-colors hover:text-[#009450]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>
            )}
          </form.Field>

          {error && (
            <p className="mt-2 text-sm font-medium text-red-400">{error}</p>
          )}

          <p className="pt-2 text-sm text-blue-200">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#009450] transition-colors hover:text-white"
            >
              Sign in
            </Link>
          </p>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#009450] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#00b864] hover:shadow-[#009450]/25 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Creating
                  account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
