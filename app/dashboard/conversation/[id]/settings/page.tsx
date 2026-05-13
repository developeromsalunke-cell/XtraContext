"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";

export default function ConversationSettingsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [conversation, setConversation] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convRes, teamsRes] = await Promise.all([
          fetch(`/api/v1/conversations/${id}`),
          fetch("/api/v1/teams")
        ]);

        if (convRes.ok) {
          const data = await convRes.json();
          setConversation(data.conversation);
          setTitle(data.conversation.title || "");
          setDescription(data.conversation.description || "");
          setTeamId(data.conversation.teamId || "");
        } else {
          router.push("/dashboard");
        }

        if (teamsRes.ok) {
          const data = await teamsRes.json();
          setTeams(data.teams || []);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/v1/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, teamId }),
      });
      if (res.ok) {
        alert("Memory logic parameters updated successfully.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update parameters.");
      }
    } catch (error) {
      console.error("Update error", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this memory? This action cannot be reversed.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete.");
        setDeleting(false);
      }
    } catch (error) {
      console.error("Delete error", error);
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-sans">
      <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            <header className="mb-16">
              <Link href={`/dashboard/conversation/${id}`} className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono hover:text-white transition-colors flex items-center gap-2 mb-10">
                &larr; Back to Thread
              </Link>
              <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Memory Config</h1>
              <p className="text-gray-400 text-[11px] font-mono font-bold tracking-widest uppercase">
                ID: {conversation?._id}
              </p>
            </header>

            <div className="space-y-12">
              {/* Identity & Metadata */}
              <section className="card-noir border-gray-700 bg-gray-900">
                <h2 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-8">Metadata Attributes</h2>
                <form onSubmit={handleUpdate} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">Designation (Title)</label>
                    <input
                      required
                      type="text"
                      className="input-noir w-full font-medium text-sm"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">Context Summary (Description)</label>
                    <textarea
                      rows={4}
                      className="input-noir w-full font-medium text-sm resize-none"
                      placeholder="Optional brief description of this memory context..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">Assigned Workspace</label>
                    <select
                      className="input-noir w-full font-mono text-xs appearance-none"
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                    >
                      {teams.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name} (Production)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      disabled={updating}
                      type="submit"
                      className="h-10 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {updating ? "Committing..." : "Commit Changes"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Danger Zone */}
              <section className="card-noir border-red-500/20 bg-red-500/5">
                 <h2 className="text-[11px] font-mono font-bold text-red-500/60 uppercase tracking-widest mb-8">Danger Zone</h2>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Purge Memory</p>
                       <p className="text-xs text-gray-500 font-medium">Permanently delete this thread and wipe all associated messages from the vault.</p>
                    </div>
                    <button 
                      onClick={handleDelete}
                      disabled={deleting}
                      className="h-10 px-8 border border-red-500/40 text-red-400 text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                       {deleting ? "Purging..." : "Delete Thread"}
                    </button>
                 </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
