"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function AssessmentRunner({ generatedId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(null);
  const [opportunityMessage, setOpportunityMessage] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const resumed = await api.resumeAssessment(generatedId);
        const attempt = resumed || (await api.startAssessment(generatedId));
        if (!active) return;
        const questions = attempt?.questions || [];
        setData(attempt);
        setAnswers(attempt?.answers || {});
        setIndex(
          questions.length
            ? Math.min(attempt?.current_step || 0, questions.length - 1)
            : 0,
        );
      } catch (err) {
        if (active) setError(err?.message || "Unable to open this assessment.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [generatedId]);

  const questions = data?.questions || [];
  const currentQuestion = questions[index];
  const selected = answers[String(index)];
  const progressPercent = questions.length
    ? Math.round(((index + 1) / questions.length) * 100)
    : 0;

  const answerList = useMemo(
    () =>
      Object.entries(answers).map(([question_index, selected_index]) => ({
        question_index: Number(question_index),
        selected_index: Number(selected_index),
      })),
    [answers],
  );

  const saveCurrentAnswer = useCallback(
    async (questionIndex, optionIndex, nextStep) => {
      setSaving(true);
      setError("");
      try {
        const saved = await api.saveAssessmentProgress(
          data.assessment_id,
          [{ question_index: questionIndex, selected_index: optionIndex }],
          nextStep,
        );
        setData((current) => ({ ...current, ...saved }));
      } catch (err) {
        setError(
          err?.message || "Your answer could not be saved. Please try again.",
        );
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [data],
  );

  const choose = async (optionIndex) => {
    if (saving || !data) return;
    const nextAnswers = { ...answers, [String(index)]: optionIndex };
    setAnswers(nextAnswers);
    try {
      await saveCurrentAnswer(index, optionIndex, index + 1);
    } catch {}
  };

  const submit = async () => {
    if (!data || saving || answerList.length !== questions.length) return;
    setSaving(true);
    setError("");
    try {
      const result = await api.submitAssessment(data.assessment_id, answerList);
      setSubmitted(result);
      setOpportunityMessage("Your score is saved. Matching opportunities…");

      try {
        const matched = await api.refreshOpportunities();
        if (matched?.opportunities?.length) {
          setOpportunityMessage(
            `${matched.opportunities.length} matched opportunit${
              matched.opportunities.length === 1 ? "y is" : "ies are"
            } ready for you.`,
          );
        } else {
          setOpportunityMessage(
            matched?.message ||
              "No opportunities are available for this performance tier yet.",
          );
        }
      } catch (matchError) {
        if (matchError?.status === 409) {
          setOpportunityMessage(
            "Assessment complete. Refresh the Opportunities tab to see matches.",
          );
        } else {
          setOpportunityMessage(
            "Assessment complete. Open the Opportunities tab to view matches.",
          );
        }
      }
    } catch (err) {
      setError(err?.message || "We could not submit your assessment.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[#072540]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-[#009450] uppercase">
          Assessment complete
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#072540]">
          Your progress is updated
        </h1>
        <p className="mt-4 text-slate-500">
          You scored{" "}
          <strong className="text-[#072540]">{submitted.score}%</strong> and
          were placed in the{" "}
          <strong className="text-[#072540]">
            {submitted.performance_tier}
          </strong>{" "}
          tier.
        </p>
        {opportunityMessage && (
          <p className="mt-3 text-sm text-slate-500">{opportunityMessage}</p>
        )}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/Dashboard/progress")}
            className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-[#072540]"
          >
            View progress
          </button>
          <button
            onClick={() => router.push("/Dashboard/opportunities")}
            className="rounded-xl bg-[#072540] px-6 py-3 font-semibold text-white"
          >
            View opportunities
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length || !currentQuestion) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-amber-800">
        This assessment does not contain any questions.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex justify-between text-sm text-slate-500">
        <span>
          Question {index + 1} of {questions.length}
        </span>
        <span>{progressPercent}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-[#072540] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <article className="mt-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-[#072540] uppercase">
          {data.category || "Personalized assessment"}
        </p>
        <h1 className="mt-2 text-2xl leading-9 font-bold text-[#072540]">
          {currentQuestion.question}
        </h1>

        <div className="mt-7 space-y-3">
          {currentQuestion.options.map((option, optionIndex) => (
            <button
              key={`${index}-${optionIndex}`}
              type="button"
              disabled={saving}
              onClick={() => choose(optionIndex)}
              className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition ${
                selected === optionIndex
                  ? "border-[#009450] bg-slate-50 text-[#009450]"
                  : "border-slate-200 text-slate-700 hover:border-[#009450]"
              }`}
            >
              <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-7 flex justify-between gap-3">
          <button
            type="button"
            disabled={index === 0 || saving}
            onClick={() => setIndex((current) => current - 1)}
            className="rounded-xl border px-5 py-3 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          {index < questions.length - 1 ? (
            <button
              type="button"
              disabled={selected === undefined || saving}
              onClick={() => setIndex((current) => current + 1)}
              className="flex items-center gap-2 rounded-xl bg-[#009450] px-6 py-3 text-sm font-semibold text-white disabled:bg-slate-300"
            >
              {saving && <Loader2 size={16} className="animate-spin" />} Next
            </button>
          ) : (
            <button
              type="button"
              disabled={
                selected === undefined ||
                saving ||
                answerList.length !== questions.length
              }
              onClick={submit}
              className="flex items-center gap-2 rounded-xl bg-[#009450] px-6 py-3 text-sm font-semibold text-white disabled:bg-slate-300"
            >
              {saving && <Loader2 size={16} className="animate-spin" />} Submit
              assessment
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
