"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // New Thread Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [convRes, teamsRes] = await Promise.all([
        fetch("/api/v1/conversations"),
        fetch("/api/v1/teams")
      ]);
      
      if (convRes.ok) {
        const data = await convRes.json();
        setConversations(data.conversations || []);
      }
      
      if (teamsRes.ok) {
        const data = await teamsRes.json();
        setTeams(data.teams || []);
        if (data.teams.length > 0) {
          setSelectedTeamId(data.teams[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedTeamId) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/conversations", {
        method: "POST",
        body: JSON.stringify({ title, description, teamId: selectedTeamId }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/thread/${data.conversationId}`);
      }
    } catch (error) {
      console.error("Failed to create thread", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTeamInline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/teams", {
        method: "POST",
        body: JSON.stringify({ name: newTeamName }),
      });
      if (res.ok) {
        const data = await res.json();
        // Refresh teams and select the new one
        const teamsRes = await fetch("/api/v1/teams");
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData.teams);
          setSelectedTeamId(data.team._id);
          setIsCreatingTeam(false);
          setNewTeamName("");
        }
      }
    } catch (error) {
      console.error("Failed to create team", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">Memory Vault</h1>
                <p className="text-gray-500 text-[11px] font-mono font-bold tracking-widest uppercase">Central Intelligence & Context Management</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(true)}
                  className="h-12 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
                >
                  + New Thread
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Recent Threads */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between mb-4">
                     <h2 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">Recent Activity</h2>
                     <Link href="/dashboard/conversations" className="text-[10px] font-bold text-gray-600 hover:text-white uppercase tracking-widest transition-colors">View All &rarr;</Link>
                  </div>
                  
                  {loading ? (
                    Array(4).fill(0).map((_, i) => (
                      <div key={i} className="h-24 bg-gray-900/50 border border-gray-800 rounded-lg animate-pulse" />
                    ))
                  ) : conversations.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-gray-800 rounded-lg">
                       <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest font-bold">No context threads found.</p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <Link 
                        key={conv._id} 
                        href={`/dashboard/thread/${conv._id}`}
                        className="block card-noir hover:border-white transition-all group"
                      >
                        <div className="flex items-center justify-between">
                           <div>
                              <h3 className="text-lg font-bold uppercase tracking-tight group-hover:text-white mb-1">{conv.title}</h3>
                              <p className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">
                                 {conv.model || "Unknown Model"} • {new Date(conv.updatedAt).toLocaleDateString()}
                              </p>
                           </div>
                           <span className="text-gray-700 group-hover:text-white transition-colors">→</span>
                        </div>
                      </Link>
                    ))
                  )}
               </div>

               {/* Right Sidebar Stats */}
               <div className="lg:col-span-4 space-y-8">
                  <section className="card-noir border-gray-800 bg-gray-950">
                     <h3 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-6">Vault Metrics</h3>
                     <div className="space-y-6">
                        <div>
                           <p className="text-2xl font-bold tracking-tighter uppercase">{conversations.length}</p>
                           <p className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-widest">Total Threads</p>
                        </div>
                        <div>
                           <p className="text-2xl font-bold tracking-tighter uppercase">{teams.length}</p>
                           <p className="text-[10px] font-mono text-gray-600 font-bold uppercase tracking-widest">Active Workspaces</p>
                        </div>
                     </div>
                  </section>
                  
                  <section className="card-noir border-gray-800">
                     <h3 className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-6">Active Teams</h3>
                     <div className="space-y-3">
                        {teams.map(team => (
                          <div key={team._id} className="flex items-center justify-between group cursor-pointer">
                             <span className="text-[11px] font-bold text-gray-500 group-hover:text-white uppercase transition-colors">{team.name}</span>
                             <span className="text-[9px] font-mono text-gray-700">{team.members?.length}m</span>
                          </div>
                        ))}
                     </div>
                  </section>
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* NEW THREAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="w-full max-w-xl card-noir bg-gray-900 border-gray-700 p-10 space-y-8 animate-in fade-in zoom-in duration-200">
              
              {!isCreatingTeam ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold uppercase tracking-tight">Initiate Thread</h2>
                    <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">&times;</button>
                  </div>

                  <form onSubmit={handleCreateThread} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Assign to Workspace</label>
                       <div className="flex gap-2">
                          <select 
                            required
                            className="input-noir flex-1 uppercase font-mono text-xs appearance-none"
                            value={selectedTeamId}
                            onChange={(e) => setSelectedTeamId(e.target.value)}
                          >
                             {teams.length === 0 && <option value="">No teams available</option>}
                             {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                          </select>
                          <button 
                            type="button"
                            onClick={() => setIsCreatingTeam(true)}
                            className="px-4 bg-gray-800 text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-700"
                          >
                            + New Team
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Thread Title</label>
                       <input
                          autoFocus
                          required
                          type="text"
                          placeholder="E.G. OAUTH IMPLEMENTATION"
                          className="input-noir w-full uppercase font-mono text-xs"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Abstract (Optional)</label>
                       <textarea
                          placeholder="Brief description of the context being captured..."
                          className="input-noir w-full font-sans text-sm h-24 resize-none"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="button"
                         onClick={() => setShowModal(false)}
                         className="flex-1 h-12 border border-gray-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors"
                       >
                         Cancel
                       </button>
                       <button 
                         disabled={submitting || (teams.length === 0 && !isCreatingTeam)}
                         type="submit"
                         className="flex-1 h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                       >
                         {submitting ? "Processing..." : "Create Thread"}
                       </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold uppercase tracking-tight">Create New Team</h2>
                    <p className="text-gray-400 text-sm">Organize your memory threads into a new workspace.</p>
                  </div>

                  <form onSubmit={handleCreateTeamInline} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Team Name</label>
                       <input
                          autoFocus
                          required
                          type="text"
                          placeholder="E.G. ENGINEERING CORE"
                          className="input-noir w-full uppercase font-mono text-xs"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                       />
                    </div>

                    <div className="flex gap-4 pt-4">
                       <button 
                         type="button"
                         onClick={() => setIsCreatingTeam(false)}
                         className="flex-1 h-12 border border-gray-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors"
                       >
                         Back
                       </button>
                       <button 
                         disabled={submitting}
                         type="submit"
                         className="flex-1 h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                       >
                         {submitting ? "Creating..." : "Confirm Team"}
                       </button>
                    </div>
                  </form>
                </>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
