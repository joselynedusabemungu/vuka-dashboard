"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import ContentCard from "./ContentCard";
import { api } from "../../lib/api";

export default function MissionsDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.recommendedContent(12);
      setItems(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err?.message || "Unable to load recommended content.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      const result = await api.refreshRecommendedContent(12);
      setItems(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err?.message || "Unable to refresh recommendations.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div>
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#072540]">Missions</h1>
          <p className="mt-2 text-slate-500">
            Discover recommended content and build knowledge through action.
          </p>
        </div>
        <button
          type="button"
          disabled={refreshing}
          onClick={refresh}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#072540] hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />{" "}
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#072540]" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-5 text-red-700">{error}</div>
      ) : items.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ContentCard
              key={item.content_pathway_id}
              content={item}
              onUpdated={load}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          No content matches your current profile yet. Please try again later.
        </div>
      )}
    </div>
  );
}
