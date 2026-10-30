"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCcw } from "lucide-react";
import Link from "next/link";
import OverallProgress from "../progress/OverallProgress";
import StreakCount from "../progress/StreakCount";
import CompletedAssessments from "../progress/CompletedAssessments";
import { api } from "../../lib/api";

export default function ProgressDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await api.progressSummary());
    } catch (err) {
      setError(err?.message || "Unable to load your progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
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
          className="mt-4 rounded-lg bg-white px-4 py-2 font-semibold text-[#072540] shadow-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  const completed = (data?.completed_assessments || []).map((item) => ({
    name: item.category || "Assessment",
    date: item.assessment_date
      ? new Date(item.assessment_date).toLocaleDateString()
      : "—",
    score: `${item.score ?? 0}%`,
  }));

  return (
    <div className="w-full">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#072540]">Progress</h1>
          <p className="mt-2 text-slate-500">
            Track your learning streaks and review your performance.
          </p>
        </div>

        <Link
          href="/onboarding"
          className="flex items-center gap-2 rounded-xl border-2 border-[#072540] px-4 py-2 text-sm font-bold text-[#072540] transition-colors hover:bg-[#072540] hover:text-white"
        >
          <RefreshCcw size={16} /> Retake Assessment
        </Link>
      </div>

      <div className="mb-6 grid gap-6 md:grid-cols-2">
        <OverallProgress percentage={data?.overall_progress || 0} />
        <StreakCount currentStreak={data?.current_streak || 0} />
      </div>

      <div>
        <CompletedAssessments data={completed} />
      </div>
    </div>
  );
}
