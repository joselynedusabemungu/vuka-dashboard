"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import ContentCard from "./ContentCard";
import { api } from "../../lib/api";

export default function HomeDashboard() {
  const [user, setUser] = useState(null);
  const [content, setContent] = useState([]);
  const [progress, setProgress] = useState(null);
  const [opportunities, setOpportunities] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [me, items, summary] = await Promise.all([
        api.me(),
        api.recommendedContent(4), // Only fetch 4 items for home dashboard
        api.progressSummary().catch(() => null),
      ]);
      setUser(me);
      setContent(Array.isArray(items) ? items : []);
      setProgress(summary);

      try {
        const opps = await api.opportunities();
        if (opps?.opportunities?.length) setOpportunities(opps);
      } catch {}
    } catch (err) {
      setError(err?.message || "Unable to load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#072540]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        <p>{error}</p>
        <button
          onClick={load}
          className="mt-4 rounded-lg bg-white px-4 py-2 font-semibold text-red-700 shadow-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-slate-500">Welcome back</p>
        <h1 className="mt-1 text-3xl font-bold text-[#072540]">
          {user?.first_name || user?.username || "Learner"}
        </h1>
        <p className="mt-2 text-slate-500">
          Keep learning from content that matches where you want to go.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Overall progress"
          value={`${progress?.overall_progress ?? 0}%`}
        />
        <Metric
          label="Current streak"
          value={`${progress?.current_streak ?? 0} days`}
        />
        <Metric
          label="Assessments completed"
          value={`${progress?.completed_assessments?.length ?? 0}`}
        />
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#072540]">
              Recommended for you
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Selected using your interests, goals and preferred platforms.
            </p>
          </div>
        </div>
        {content.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {content.map((item) => (
              <ContentCard
                key={item.content_pathway_id}
                content={item}
                onUpdated={load}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No recommendations are available yet. Please check again after the
            content pool is refreshed.
          </div>
        )}

        {content.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/Dashboard/missions"
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-6 py-3 text-sm font-bold text-[#072540] transition hover:bg-slate-200"
            >
              Explore all missions <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </section>

      {opportunities?.opportunities?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#072540]">
                Your opportunities
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Matched from your latest completed assessment.
              </p>
            </div>
            <Link
              href="/Dashboard/opportunities"
              className="text-sm font-semibold text-[#009450] hover:underline"
            >
              Explore
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#072540]">{value}</p>
    </div>
  );
}
