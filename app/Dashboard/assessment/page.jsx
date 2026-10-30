"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import AppShell from "../../../components/layout/AppShell";
import { api } from "../../../lib/api";

export default function Page() {
  const [assessments, setAssessments] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [generated, userAttempts] = await Promise.all([
        api.generatedAssessments().catch(() => []),
        api.myAssessments().catch(() => []),
      ]);
      setAssessments(Array.isArray(generated) ? generated : []);
      setAttempts(Array.isArray(userAttempts) ? userAttempts : []);
    } catch (err) {
      setError(err?.message || "Unable to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const attemptByGeneratedId = new Map(
    attempts.map((attempt) => [attempt.generated_assessment_id, attempt]),
  );

  return (
    <AppShell>
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#072540]" />
        </div>
      ) : (
        <div>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#072540]">Assessments</h1>
              <p className="mt-2 text-slate-500">
                Personalized assessments generated from content you have
                watched.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-[#072540] hover:bg-slate-50"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {assessments.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {assessments.map((assessment) => {
                const attempt = attemptByGeneratedId.get(
                  assessment.assessment_id,
                );
                const completed = attempt?.status === "completed";
                return (
                  <article
                    key={assessment.assessment_id}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <p className="text-xs font-semibold tracking-wide text-[#072540] uppercase">
                      {assessment.category || "Personalized"}
                    </p>
                    <h2 className="mt-2 text-lg font-bold text-[#072540]">
                      Content assessment
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Generated from content #{assessment.content_id} on{" "}
                      {new Date(assessment.generated_at).toLocaleDateString()}.
                    </p>
                    {completed && (
                      <p className="mt-3 text-sm font-semibold text-[#072540]">
                        Completed · {attempt.score}%
                      </p>
                    )}
                    <Link
                      href={
                        completed
                          ? "/Dashboard/progress"
                          : `/assessment/${assessment.assessment_id}`
                      }
                      className="mt-5 block rounded-xl bg-[#072540] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[#0a3358]"
                    >
                      {completed
                        ? "View result"
                        : attempt?.status === "in_progress"
                          ? "Resume assessment"
                          : "Start assessment"}
                    </Link>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              Watch recommended content first. Vuka will generate a personalized
              10-question assessment for that content.
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
