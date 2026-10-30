"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Camera, Loader2, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";
import Avatar from "./Avatar.jsx";

export default function AccountView({
  profile,
  avatarUrl,
  onBack,
  onChangePhoto,
  onSave,
}) {
  const form = useForm({
    defaultValues: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      username: profile?.username ?? "",
      email: profile?.email ?? "",
    },
    onSubmit: async ({ value }) => {
      await onSave(value);
    },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl bg-[#072540] p-8 shadow-2xl duration-500">
      <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-semibold text-blue-200 transition-colors hover:text-white"
        >
          <div className="rounded-full bg-white/5 p-2 transition-colors group-hover:bg-[#009450]">
            <ArrowLeft size={16} />
          </div>
          Back to Settings
        </button>
        <span className="text-xs font-bold tracking-widest text-[#009450] uppercase">
          Account Profile
        </span>
      </div>

      <div className="mb-10 flex flex-col items-center justify-center gap-4">
        <form.Field name="firstName">
          {(field) => {
            const initial =
              (field.state.value ?? "").trim().charAt(0).toUpperCase() || "?";
            return <Avatar url={avatarUrl} initial={initial} size={104} />;
          }}
        </form.Field>

        <button
          type="button"
          onClick={onChangePhoto}
          className="flex items-center gap-2 rounded-full bg-white/5 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
        >
          <Camera size={16} className="text-[#009450]" />
          Update Photo
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="mx-auto max-w-2xl space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <form.Field name="firstName">
            {(field) => (
              <label className="group block">
                <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                  First name
                </span>
                <input
                  type="text"
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  required
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
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  required
                />
              </label>
            )}
          </form.Field>
        </div>

        <form.Field name="username">
          {(field) => (
            <label className="block">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-blue-100">
                  Username
                </span>
                <span className="flex items-center gap-1 text-xs text-[#009450]">
                  <CheckCircle2 size={12} /> Verified
                </span>
              </div>
              <input
                type="text"
                value={field.state.value ?? ""}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-sm text-blue-200/50 outline-none"
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
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                required
              />
            </label>
          )}
        </form.Field>

        <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="group flex w-auto min-w-[140px] items-center justify-center gap-2 rounded-xl bg-[#009450] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#00b864] hover:shadow-[#009450]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            )}
          </form.Subscribe>
        </div>
      </form>
    </div>
  );
}

AccountView.propTypes = {
  profile: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
  avatarUrl: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  onChangePhoto: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
