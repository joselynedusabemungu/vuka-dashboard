"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";
import {
  BookOpen,
  Briefcase,
  Camera,
  Code,
  Crown,
  Lightbulb,
  Music2,
  Paintbrush,
  Palette,
  Play,
  Rocket,
  Sprout,
  Users,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api } from "../lib/api";

const INTERESTS = [
  { name: "Technology", icon: Code },
  { name: "Business", icon: Briefcase },
  { name: "Design", icon: Palette },
  { name: "Career Growth", icon: Rocket },
  { name: "Education", icon: BookOpen },
  { name: "Entrepreneurship", icon: Lightbulb },
  { name: "Networking", icon: Users },
  { name: "Leadership", icon: Crown },
  { name: "Personal Growth", icon: Sprout },
  { name: "Creative Arts", icon: Paintbrush },
];

const PLATFORMS = [
  { name: "TikTok", value: "tiktok", icon: Music2 },
  { name: "YouTube", value: "youtube", icon: Play },
  { name: "Instagram", value: "instagram", icon: Camera },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [existingOnboardingId, setExistingOnboardingId] = useState(null);

  const form = useForm({
    defaultValues: { interests: [], goal: "", platforms: [] },
    onSubmit: async ({ value }) => {
      if (!value.interests.length)
        return setError("Select at least one interest.");
      if (!value.platforms.length)
        return setError("Select at least one platform.");
      if (!userId) return setError("Could not identify your account.");

      setSaving(true);
      setError("");
      try {
        const payload = {
          user_interests: { selected: value.interests },
          social_platforms: value.platforms,
          user_goal: { description: value.goal.trim() },
          career_aspirations: value.goal.trim() || value.interests.join(", "),
        };

        if (existingOnboardingId) {
          await api.updateOnboarding(existingOnboardingId, payload);
        } else {
          await api.saveOnboarding({ ...payload, user_id: userId });
        }

        router.replace("/Dashboard/home");
      } catch (err) {
        setError(err?.message || "Could not save onboarding.");
      } finally {
        setSaving(false);
      }
    },
  });

  const interests = useStore(form.store, (state) => state.values.interests);
  const platforms = useStore(form.store, (state) => state.values.platforms);
  const goal = useStore(form.store, (state) => state.values.goal);

  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const user = await api.me();
        if (!active) return;
        setUserId(user.user_id);

        try {
          const existing = await api.onboarding();
          if (active) {
            setExistingOnboardingId(existing.onboarding_id);
            form.setFieldValue(
              "interests",
              existing.user_interests?.selected || [],
            );
            form.setFieldValue("platforms", existing.social_platforms || []);
            form.setFieldValue("goal", existing.user_goal?.description || "");
            setChecking(false);
          }
        } catch (err) {
          if (err?.status === 404) {
            if (active) setChecking(false);
          } else if (err?.status === 401) {
            router.replace("/login");
          } else {
            throw err;
          }
        }
      } catch (err) {
        if (!active) return;
        if (err?.status === 401) return router.replace("/login");
        setError(err?.message || "Could not verify account.");
        setChecking(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, [router]);

  const toggleInterest = (name) => {
    form.setFieldValue("interests", (curr) =>
      curr.includes(name) ? curr.filter((i) => i !== name) : [...curr, name],
    );
    setError("");
  };

  const togglePlatform = (value) => {
    form.setFieldValue("platforms", (curr) =>
      curr.includes(value) ? curr.filter((i) => i !== value) : [...curr, value],
    );
    setError("");
  };

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse font-medium text-slate-500">
          Loading your profile...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        <div className="mb-12 flex items-center justify-center gap-4">
          <div
            className={`flex items-center gap-2 ${step >= 1 ? "text-[#072540]" : "text-slate-400"}`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${step >= 1 ? "bg-[#072540] text-white" : "bg-slate-200"}`}
            >
              1
            </span>
            <span className="hidden font-semibold sm:block">Interests</span>
          </div>
          <div
            className={`h-1 w-16 rounded-full ${step >= 2 ? "bg-[#072540]" : "bg-slate-200"}`}
          />
          <div
            className={`flex items-center gap-2 ${step >= 2 ? "text-[#072540]" : "text-slate-400"}`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${step >= 2 ? "bg-[#072540] text-white" : "bg-slate-200"}`}
            >
              2
            </span>
            <span className="hidden font-semibold sm:block">Platforms</span>
          </div>
        </div>

        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#072540] sm:text-4xl">
                {existingOnboardingId
                  ? "Update your interests"
                  : "What sparks your interest?"}
              </h1>
              <p className="mt-3 text-lg text-slate-500">
                {existingOnboardingId
                  ? "Update what you want to explore next."
                  : "Select the areas you want to explore."}
              </p>
            </div>

            <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {INTERESTS.map(({ name, icon: Icon }) => {
                const selected = interests.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleInterest(name)}
                    className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-6 transition-all duration-200 ${
                      selected
                        ? "scale-[1.02] border-[#009450] bg-[#009450]/5 shadow-md"
                        : "border-slate-200 bg-white hover:border-[#009450]/50 hover:shadow-sm"
                    }`}
                  >
                    {selected && (
                      <CheckCircle2
                        size={18}
                        className="absolute top-3 right-3 text-[#009450]"
                      />
                    )}
                    <Icon
                      size={28}
                      className={selected ? "text-[#009450]" : "text-slate-400"}
                    />
                    <span
                      className={`text-center text-sm font-bold ${selected ? "text-[#009450]" : "text-slate-700"}`}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mx-auto mb-10 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <label className="mb-3 block text-lg font-bold text-[#072540]">
                {existingOnboardingId
                  ? "Update your goals"
                  : "Tell us about your goals"}
              </label>
              <textarea
                value={goal}
                onChange={(e) => form.setFieldValue("goal", e.target.value)}
                placeholder="e.g., I want to learn web development and find a scholarship..."
                rows={4}
                maxLength={5000}
                className="w-full resize-none rounded-xl border border-slate-200 p-4 text-slate-700 transition outline-none focus:border-[#009450] focus:ring-2 focus:ring-[#009450]/20"
              />
            </div>

            <div className="mx-auto flex max-w-2xl justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!interests.length)
                    return setError("Please select at least one interest.");
                  setError("");
                  setStep(2);
                }}
                className="rounded-xl bg-[#072540] px-10 py-4 font-bold text-white shadow-lg transition-transform hover:bg-[#0a3358] active:scale-95"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="mb-10 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#072540] sm:text-4xl">
                {existingOnboardingId
                  ? "Update your platforms"
                  : "Where do you learn best?"}
              </h1>
              <p className="mt-3 text-lg text-slate-500">
                {existingOnboardingId
                  ? "Update your preferred platforms."
                  : "Select the platforms you use the most."}
              </p>
            </div>

            <div className="mx-auto mb-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
              {PLATFORMS.map(({ name, value, icon: Icon }) => {
                const selected = platforms.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => togglePlatform(value)}
                    className={`relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 p-10 transition-all duration-300 ${
                      selected
                        ? "scale-[1.02] border-[#009450] bg-[#009450] text-white shadow-xl"
                        : "border-slate-200 bg-white text-[#072540] hover:border-[#009450]/50 hover:shadow-md"
                    }`}
                  >
                    {selected && (
                      <div className="absolute top-4 right-4 rounded-full bg-white">
                        <CheckCircle2 size={24} className="text-[#009450]" />
                      </div>
                    )}
                    <Icon size={48} strokeWidth={1.5} />
                    <span className="text-xl font-bold">{name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mx-auto flex max-w-3xl items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-xl border-2 border-slate-200 bg-white px-8 py-4 font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                disabled={!platforms.length || saving || !userId}
                onClick={() => form.handleSubmit()}
                className="flex items-center gap-2 rounded-xl bg-[#009450] px-10 py-4 font-bold text-white shadow-lg transition-transform hover:bg-[#007a41] active:scale-95 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving...
                  </>
                ) : existingOnboardingId ? (
                  "Save Changes"
                ) : (
                  "Finish Setup"
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="animate-in fade-in mt-6 rounded-xl bg-red-50 p-4 text-center font-medium text-red-600">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
