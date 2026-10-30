"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Loader2, RefreshCw, Lock } from "lucide-react";
import { api } from "../../lib/api";

export default function OpportunitiesDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [hasRefreshed, setHasRefreshed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.opportunities();
      setData(result);
      if (result?.opportunities?.length > 0) {
        setHasRefreshed(true);
      }
    } catch (err) {
      if (err?.status === 409) {
        setData({
          opportunities: [],
          performance_tier: "—",
          message: "Complete an assessment to unlock opportunities.",
        });
      } else {
        setError(err?.message || "Unable to load your opportunities.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => {
    if (hasRefreshed) return;
    setRefreshing(true);
    setError("");
    try {
      const result = await api.refreshOpportunities();
      setData(result);
      if (result?.opportunities?.length > 0) {
        setHasRefreshed(true);
      }
    } catch (err) {
      if (err?.status === 409) {
        setData({
          opportunities: [],
          performance_tier: "—",
          message:
            err?.message ||
            "Complete an assessment before requesting opportunities.",
        });
      } else {
        setError(err?.message || "Unable to refresh your matches.");
      }
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#072540]" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#072540]">Opportunities</h1>
          <p className="mt-2 text-slate-500">
            Opportunities matched to your interests and latest performance.
          </p>
        </div>

        <button
          type="button"
          disabled={
            refreshing ||
            hasRefreshed ||
            data?.performance_tier === "Low" ||
            data?.performance_tier === "—"
          }
          onClick={refresh}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
            hasRefreshed ||
            data?.performance_tier === "Low" ||
            data?.performance_tier === "—"
              ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
              : "border border-slate-200 bg-white text-[#072540] hover:bg-slate-50"
          }`}
        >
          {hasRefreshed ? (
            <Lock size={16} />
          ) : (
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          )}
          {hasRefreshed ? "Matches Locked" : "Refresh matches"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-amber-50 p-5 text-sm text-amber-800">
          {error}
        </div>
      )}

      {data ? (
        <>
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Current performance tier</p>
            <p className="mt-1 text-2xl font-bold text-[#072540]">
              {data.performance_tier}
            </p>
            <p className="mt-2 text-sm text-slate-500">{data.message}</p>
          </div>

          {data.opportunities?.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {data.opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.opportunity_id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              {data.performance_tier === "Low"
                ? "Opportunities are locked for now. Retake your assessment after building your skills."
                : "No matching opportunities are available yet. Try refreshing your matches."}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function OpportunityCard({ opportunity }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-wide text-[#009450] uppercase">
            {opportunity.subject_field}
          </p>
          <h2 className="mt-2 line-clamp-2 text-xl font-bold text-[#072540]">
            {opportunity.media_description?.slice(0, 100) || "Opportunity"}
          </h2>
        </div>
        <span className="rounded-full bg-slate-50 px-3 py-1 text-sm font-bold text-[#009450]">
          {opportunity.match_score ?? "—"}
          {opportunity.match_score != null ? "%" : ""}
        </span>
      </div>

      <div className="mt-4 flex-1">
        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
          {opportunity.media_description}
        </p>
        {opportunity.match_reason && (
          <p className="mt-4 text-sm font-medium text-[#009450]">
            {opportunity.match_reason}
          </p>
        )}
      </div>

      <a
        href={opportunity.external_media_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#009450] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#007a41]"
      >
        Apply / View Opportunity <ExternalLink size={16} />
      </a>
    </article>
  );
}
