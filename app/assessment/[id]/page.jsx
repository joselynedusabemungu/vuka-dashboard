"use client";

import { useParams } from "next/navigation";
import AssessmentRunner from "../../../components/dashboard/AssessmentRunner";
import AppShell from "../../../components/layout/AppShell";

export default function Page() {
  const { id } = useParams();
  const generatedId = Number(id);

  if (!Number.isInteger(generatedId) || generatedId <= 0) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-red-700">
          Invalid assessment.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AssessmentRunner generatedId={generatedId} />
    </AppShell>
  );
}
