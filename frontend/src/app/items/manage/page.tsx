"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api, apiErrorMessage } from "@/lib/api";
import { University } from "@/types";
import { useState } from "react";

function ManageList() {
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["universities", "mine"],
    queryFn: async () => {
      const res = await api.get("/universities/mine");
      return res.data.items as University[];
    },
  });

  async function handleDelete(id: string) {
    setError("");
    setDeletingId(id);
    try {
      await api.delete(`/universities/${id}`);
      queryClient.invalidateQueries({ queryKey: ["universities", "mine"] });
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="container-page py-12">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Protected</p>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold text-navy">Manage your listings</h1>
        <Link
          href="/items/add"
          className="rounded-full bg-navy px-5 py-2 text-sm font-medium text-paper hover:bg-navy-light"
        >
          + Add new
        </Link>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {isLoading && <p className="mt-8 text-sm text-ink/60">Loading your listings…</p>}

      {data?.length === 0 && (
        <p className="mt-8 text-sm text-ink/60">
          You haven&apos;t added any listings yet.{" "}
          <Link href="/items/add" className="text-teal underline">Add your first one</Link>.
        </p>
      )}

      {data && data.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-card border border-navy/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy/5 font-mono text-xs uppercase tracking-wider text-navy/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Tuition</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((uni) => (
                <tr key={uni._id} className="border-t border-navy/10">
                  <td className="px-4 py-3 font-medium text-navy">{uni.name}</td>
                  <td className="px-4 py-3 text-ink/70">{uni.country}</td>
                  <td className="px-4 py-3 font-mono text-ink/70">${uni.tuitionUSD.toLocaleString()}</td>
                  <td className="px-4 py-3 text-ink/70">
                    {new Date(uni.applicationDeadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/explore/${uni._id}`} className="text-teal hover:underline">
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(uni._id)}
                        disabled={deletingId === uni._id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === uni._id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ManageItemsPage() {
  return (
    <ProtectedRoute>
      <ManageList />
    </ProtectedRoute>
  );
}
