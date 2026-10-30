"use client";

import { useForm } from "@tanstack/react-form";
import { ArrowLeft, LifeBuoy, Loader2 } from "lucide-react";
import PropTypes from "prop-types";

const SUPPORT_TOPICS = ["Account", "Assessments", "Opportunities", "Other"];
const MESSAGE_MAX_LENGTH = 500;

export default function SupportView({ onBack, onSend, user }) {
  const form = useForm({
    defaultValues: {
      topic: "Account",
      message: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await fetch("https://formspree.io/f/mzdnpkdq", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic: value.topic, message: value.message }),
        });
        if (response.ok) onSend();
        else alert("There was a problem submitting your message.");
      } catch {
        alert("Network error. Please try again.");
      }
    },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 rounded-3xl bg-[#072540] p-8 shadow-2xl duration-500">
      {/* Header & Back Button */}
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
          <LifeBuoy size={12} /> Support
        </span>
      </div>

      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-white">Help & Support</h2>
        <p className="mt-2 text-sm text-blue-200">
          Send us a message on any concern within the app. We typically respond
          within 24 hours.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <form.Field name="topic">
            {(field) => (
              <div>
                <span className="mb-3 block text-sm font-bold text-blue-100">
                  What is it about?
                </span>
                <div className="flex flex-wrap gap-2">
                  {SUPPORT_TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.handleChange(t)}
                      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        field.state.value === t
                          ? "scale-105 bg-[#009450] text-white shadow-md shadow-[#009450]/20"
                          : "bg-white/5 text-blue-100 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form.Field>

          <form.Field name="message">
            {(field) => (
              <label className="group block">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-100 transition-colors group-focus-within:text-[#009450]">
                    Your message
                  </span>
                  <span
                    className={`text-xs transition-colors ${
                      field.state.value.length >= MESSAGE_MAX_LENGTH
                        ? "text-red-400"
                        : "text-blue-200/60"
                    }`}
                  >
                    {field.state.value.length}/{MESSAGE_MAX_LENGTH}
                  </span>
                </div>
                <textarea
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value.slice(0, MESSAGE_MAX_LENGTH),
                    )
                  }
                  placeholder="Describe your issue or question..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white backdrop-blur-sm transition-all outline-none placeholder:text-blue-200/30 focus:border-[#009450] focus:bg-[#009450]/5 focus:ring-4 focus:ring-[#009450]/10"
                  rows={6}
                  required
                />
              </label>
            )}
          </form.Field>

          <div className="mt-8 flex justify-end border-t border-white/10 pt-6">
            <form.Subscribe
              selector={(state) => [
                state.isSubmitting,
                !state.values.message.trim(),
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
                    "Send message"
                  )}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  );
}

SupportView.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  user: PropTypes.object,
};
