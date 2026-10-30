import React from "react";
import { ClipboardList } from "lucide-react";

export default function CompletedAssessments({ data = [] }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-bold text-[#072540]">
          Completed Assessments
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500">
          <ClipboardList size={40} className="mb-3 text-slate-300" />
          <p>Do an assessment to record your progress here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xl font-bold text-[#072540]">
        Completed Assessments
      </h3>
      <div className="flex flex-col">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0"
          >
            <div className="flex w-1/3 items-center gap-3">
              <ClipboardList size={20} className="text-[#009450]" />
              <span className="font-semibold text-[#072540]">{item.name}</span>
            </div>
            <span className="w-1/3 text-left text-sm text-slate-500">
              {item.date}
            </span>
            <span className="w-1/3 text-right font-bold text-[#009450]">
              {item.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
