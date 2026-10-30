"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export default function SecurityView({ email, onBack, onSave }) {
  const form = useForm({
    defaultValues: { confirm: "" },
    onSubmit: async () => onSave(),
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
        <span className="flex items-center gap-1 text-xs font-bold tracking-widest text-[#009450] uppercase">
          <Lock size={12} /> Security
        </span>
      </div>

      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-white">Reset your password</h2>
        <p className="mt-2 text-sm text-blue-200">
          We'll send a secure password-reset link to the email connected to your
          Vuka account.
        </p>

        <div className="mt-8 space-y-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-blue-100">
              Account Email
            </span>
            <input
              className="w-full cursor-not-allowed rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3.5 text-sm text-blue-200/50 outline-none"
              value={email || ""}
              readOnly
            />
          </label>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="pt-2"
          >
            <form.Field name="confirm">
              {(field) => (
                <label className="group block">
                  <span className="mb-2 block text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                    Confirmation
                  </span>
                  <select
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white backdrop-blur-sm transition-all outline-none focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10 [&>option]:bg-[#072540] [&>option]:text-white"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="send">Send me a password reset link</option>
                  </select>
                </label>
              )}
            </form.Field>

            <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
              <form.Subscribe
                selector={(state) => [
                  state.isSubmitting,
                  !state.values.confirm,
                ]}
              >
                {([isSubmitting, disabled]) => (
                  <button
                    type="submit"
                    disabled={disabled || isSubmitting}
                    className="group flex w-auto min-w-[160px] items-center justify-center gap-2 rounded-xl bg-[#009450] px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#00b864] hover:shadow-[#009450]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send reset link"
                    )}
                  </button>
                )}
              </form.Subscribe>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

SecurityView.propTypes = {
  email: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
