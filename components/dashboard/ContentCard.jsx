"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Loader2, Play } from "lucide-react";
import Link from "next/link";
import { api } from "../../lib/api";

const PLATFORM_LABEL = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  other: "Other",
};

function contentTitle(content) {
  const title = content.title?.trim();
  if (title) return title;
  const text = content.media_description?.trim();
  if (!text) return "Recommended content";
  const sentence = text.split(/[.!?]\s/)[0]?.trim();
  return (
    (sentence || text).slice(0, 80) +
    ((sentence || text).length > 80 ? "…" : "")
  );
}

export default function ContentCard({ content, onUpdated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [generatedAssessmentId, setGeneratedAssessmentId] = useState(
    content.generated_assessment_id ?? null,
  );

  const prepareAssessment = async () => {
    try {
      const all = await api.generatedAssessments();
      const mine = (all || []).find(
        (item) => Number(item.content_id) === Number(content.content_id),
      );
      if (mine) {
        setGeneratedAssessmentId(mine.assessment_id);
        return mine.assessment_id;
      }
    } catch {}

    try {
      const generated = await api.generateAssessment(content.content_id);
      setGeneratedAssessmentId(generated?.assessment_id ?? null);
      return generated?.assessment_id ?? null;
    } catch (error) {
      setMessage(error?.message || "Assessment is not ready yet.");
      return null;
    }
  };

  const openContent = async () => {
    if (loading) return;
    setLoading(true);
    setMessage("");

    const sourceWindow = window.open(
      content.external_media_url,
      "_blank",
      "noopener,noreferrer",
    );

    try {
      if (!content.watched) {
        await api.markWatched(content.content_pathway_id);
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const assessmentId = await prepareAssessment();
      setMessage(
        assessmentId
          ? "Watched. Your personalized assessment is ready."
          : "Watched. Your assessment is being prepared — refresh in a moment.",
      );
      await onUpdated?.();
    } catch (error) {
      setMessage(error?.message || "We could not prepare this content.");
      if (!sourceWindow) {
        setMessage(
          "Your browser blocked the source tab. Allow pop-ups for Vuka to open the content.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="group flex min-h-[270px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-center justify-between gap-3 text-xs font-semibold tracking-wide text-slate-500 uppercase">
        <span>
          {PLATFORM_LABEL[content.source_platform] || content.source_platform}
        </span>
        {content.watched && (
          <span className="flex items-center gap-1 text-[#072540]">
            <CheckCircle2 size={15} /> Watched
          </span>
        )}
      </div>

      <h3 className="line-clamp-2 text-lg font-bold text-[#072540]">
        {contentTitle(content)}
      </h3>
      <p className="mt-2 line-clamp-4 text-sm leading-6 text-slate-500">
        {content.media_description ||
          "Personalized content selected for your learning path."}
      </p>
      {content.relevance_reason && (
        <p className="mt-3 line-clamp-2 text-xs font-medium text-[#009450]">
          {content.relevance_reason}
        </p>
      )}

      <div className="mt-auto pt-5">
        <button
          onClick={openContent}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#009450] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#007a41] disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? (
            <Loader2 size={17} className="animate-spin" />
          ) : content.watched ? (
            <CheckCircle2 size={17} />
          ) : (
            <Play size={17} />
          )}
          {loading
            ? "Preparing…"
            : content.watched
              ? "Open content again"
              : "Watch content"}
          <ArrowUpRight size={16} />
        </button>

        {generatedAssessmentId && (
          <Link
            href={`/assessment/${generatedAssessmentId}`}
            className="mt-2 flex w-full items-center justify-center rounded-xl border border-[#009450] px-4 py-3 text-sm font-semibold text-[#009450] hover:bg-slate-50"
          >
            Take your assessment
          </Link>
        )}
        {message && (
          <p className="mt-2 text-center text-xs text-slate-500">{message}</p>
        )}
      </div>
    </article>
  );
}
