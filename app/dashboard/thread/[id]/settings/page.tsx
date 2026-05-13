"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  ChevronLeft, 
  Save, 
  Trash2,
  AlertTriangle,
  ArrowRight,
  Users
} from "lucide-react";

export default function ThreadSettingsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [thread, setThread] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [threadRes, teamsRes] = await Promise.all([
          fetch(`/api/v1/conversations/${id}`),
          fetch("/api/v1/teams"),
        ]);

        if (threadRes.ok) {
          const data = await threadRes.json();
          setThread(data.conversation);
          setTitle(data.conversation?.title || "");
          setDescription(data.conversation?.description || "");
          setSelectedTeamId(data.conversation?.teamId || "");
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
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/v1/conversations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, teamId: selectedTeamId }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/conversations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <div className="flex h-screen overflow-hidden">
          <DashboardSidebar />
          <main className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#FF5733] border-t-transparent rounded-full animate-spin" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-2xl mx-auto w-full">
            {/* Header */}
            <header className="mb-10">
              <Link 
                href={`/dashboard/thread/${id}`}
                className="group flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors mb-6"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Thread
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">Thread Settings</h1>
              <p className="text-sm text-gray-500 mt-2">Update the details for this conversation thread.</p>
            </header>

            {/* Form */}
            <div className="space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Thread title"
                  className="w-full h-12 bg-[#111111] border border-white/[0.06] rounded-lg px-4 text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5733]/50 transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for this thread..."
                  rows={4}
                  className="w-full bg-[#111111] border border-white/[0.06] rounded-lg px-4 py-3 text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5733]/50 transition-colors resize-none"
                />
              </div>

              {/* Team Assignment */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Assigned Team
                </label>
                <select
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full h-12 bg-[#111111] border border-white/[0.06] rounded-lg px-4 text-sm font-medium text-white focus:outline-none focus:border-[#FF5733]/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#111111]">No team assigned</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id} className="bg-[#111111]">
                      {team.name}
                    </option>
                  ))}
                </select>
                {selectedTeamId !== thread?.teamId && selectedTeamId && (
                  <p className="text-xs text-[#FF5733] mt-1 flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3" />
                    This thread will be moved to the selected team.
                  </p>
                )}
              </div>

              {/* Thread Info (read-only) */}
              <div className="p-5 bg-[#111111] border border-white/[0.06] rounded-lg space-y-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Info</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Thread ID</span>
                  <span className="text-gray-300 font-mono text-xs">{id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Model</span>
                  <span className="text-gray-300">{thread?.model || "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-300">{thread?.createdAt ? new Date(thread.createdAt).toLocaleDateString() : "—"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Updated</span>
                  <span className="text-gray-300">{thread?.updatedAt ? new Date(thread.updatedAt).toLocaleDateString() : "—"}</span>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="h-11 px-8 bg-[#FF5733] text-black text-[11px] font-bold uppercase tracking-widest rounded hover:bg-[#ff6c4d] transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {saved && (
                  <span className="text-sm text-green-400 font-medium animate-in fade-in">Changes saved!</span>
                )}
              </div>

              {/* Danger Zone */}
              <div className="border-t border-white/[0.06] pt-8 mt-8">
                <h3 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Deleting this thread will permanently remove all messages and data. This action cannot be undone.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-11 px-6 border border-red-500/30 text-red-400 text-[11px] font-bold uppercase tracking-widest rounded hover:bg-red-500/10 hover:border-red-500/50 transition-all flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Thread
                  </button>
                ) : (
                  <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-lg space-y-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-400">Are you sure?</p>
                        <p className="text-xs text-gray-500 mt-1">This will permanently delete "{thread?.title}" and all its messages.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="h-9 px-5 border border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest rounded hover:border-white/20 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="h-9 px-5 bg-red-500 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-red-600 transition-all flex items-center gap-2 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deleting ? "Deleting..." : "Yes, Delete"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
