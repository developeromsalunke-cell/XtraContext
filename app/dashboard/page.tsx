"use client";

import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  Activity, 
  Plus, 
  ArrowRight, 
  Layers, 
  Users as UsersIcon, 
  Clock,
  Zap,
  Brain,
  ChevronRight,
  MessageSquare,
  Hash,
  AlignLeft,
  X,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
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
      const [convRes, teamsRes, analyticsRes] = await Promise.all([
        fetch("/api/v1/conversations"),
        fetch("/api/v1/teams"),
        fetch("/api/v1/analytics")
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
      
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !selectedTeamId) return;
    setSubmitting(true);
    const toastId = toast.loading("Deploying context thread...");
    try {
      const res = await fetch("/api/v1/conversations", {
        method: "POST",
        body: JSON.stringify({ title, description, teamId: selectedTeamId }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Thread deployed", { id: toastId });
        router.push(`/dashboard/thread/${data.conversationId}`);
      } else {
        toast.error("Failed to create thread", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to create thread", error);
      toast.error("An error occurred", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTeamInline = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    setSubmitting(true);
    const toastId = toast.loading("Initializing workspace...");
    try {
      const res = await fetch("/api/v1/teams", {
        method: "POST",
        body: JSON.stringify({ name: newTeamName }),
      });
      if (res.ok) {
        const data = await res.json();
        const teamsRes = await fetch("/api/v1/teams");
        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeams(teamsData.teams);
          setSelectedTeamId(data.team._id);
          setIsCreatingTeam(false);
          setNewTeamName("");
          toast.success("Workspace initialized", { id: toastId });
        }
      } else {
        toast.error("Failed to create workspace", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to create team", error);
      toast.error("An error occurred", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar relative">
          {/* Subtle Background Elements Removed for high contrast */}

          <div className="max-w-6xl mx-auto w-full relative z-10">
            <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                   <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Universal Memory Layer</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient">Dashboard</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowModal(true)}
                  className="btn-premium"
                >
                  <Plus className="w-4 h-4" />
                  New Context Thread
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Recent Threads */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-500" />
                        <h2 className="text-sm font-semibold text-gray-300">Recent Architectural Activity</h2>
                     </div>
                     <Link href="/dashboard/conversations" className="text-xs font-medium text-gray-500 hover:text-[#FF5733] transition-colors flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                     </Link>
                  </div>
                  
                  <div className="space-y-3">
                    {loading ? (
                      Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-[#FF5733]/10 border border-[#FF5733]/20 rounded-2xl animate-pulse" />
                      ))
                    ) : conversations.length === 0 ? (
                      <div className="py-20 text-center border border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                         <Brain className="w-10 h-10 text-gray-700 mx-auto mb-4 opacity-50" />
                         <p className="text-sm text-gray-500 font-medium">Your memory vault is empty.</p>
                         <p className="text-xs text-gray-600 mt-1">Start by creating your first context thread.</p>
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <Link 
                          key={conv._id} 
                          href={`/dashboard/thread/${conv._id}`}
                          className="group block card-noir relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#FF5733]/0 via-white/0 to-[#FF5733]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="flex items-center justify-between relative z-10">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-[#FF5733]/30 group-hover:bg-[#FF5733]/5 transition-all">
                                   <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-[#FF5733] transition-colors" />
                                </div>
                                <div>
                                   <h3 className="text-[15px] font-semibold text-gray-200 group-hover:text-[#FF5733] mb-1 transition-colors">{conv.title}</h3>
                                   <div className="flex items-center gap-3 text-[11px] text-gray-500 font-medium">
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(conv.updatedAt).toLocaleDateString()}</span>
                                      <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {conv.messageCount || 0} logs</span>
                                   </div>
                                </div>
                             </div>
                             <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/0 group-hover:bg-[#FF5733]/10 transition-all">
                                <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#FF5733]" />
                             </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
               </div>

               {/* Right Sidebar Stats */}
               <div className="lg:col-span-4 space-y-6">
                  <section className="glass-card p-6">
                     <div className="flex items-center gap-2 mb-6">
                        <svg className="w-4 h-4 text-[#FF5733]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <rect width="18" height="18" x="3" y="3" rx="2" />
                           <circle cx="12" cy="12" r="3" />
                           <path d="M12 9v1" />
                           <path d="M12 14v1" />
                           <path d="M15 12h-1" />
                           <path d="M10 12H9" />
                        </svg>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Vault Overview</h3>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                           <p className="text-2xl font-bold text-white mb-1">{conversations.length}</p>
                           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Threads</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                           <p className="text-2xl font-bold text-white mb-1">{teams.length}</p>
                           <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Teams</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] col-span-2">
                           <div className="flex items-center justify-between">
                             <div>
                               <p className="text-xl font-bold text-white mb-1">{analytics?.totalTokens?.toLocaleString() || 0}</p>
                               <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Total Tokens</p>
                             </div>
                             <div className="text-right">
                               <p className="text-xl font-bold text-[#FF5733] mb-1">${(analytics?.totalCost || 0).toFixed(4)}</p>
                               <p className="text-[10px] font-bold text-[#FF5733]/60 uppercase tracking-wider">Est. Cost</p>
                             </div>
                           </div>
                        </div>
                     </div>
                  </section>
                  
                  <section className="card-noir">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                           <Layers className="w-4 h-4 text-[#FF5733]" />
                           <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Spaces</h3>
                        </div>
                        <Link href="/dashboard/teams" className="p-1.5 rounded-lg hover:bg-[#FF5733]/10 hover:text-[#FF5733] transition-colors">
                           <Plus className="w-3.5 h-3.5 text-gray-500 hover:text-[#FF5733]" />
                        </Link>
                     </div>
                     <div className="space-y-2">
                        {teams.map(team => (
                           <div key={team._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FF5733]/5 cursor-pointer group transition-all border border-transparent hover:border-[#FF5733]/20">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:text-[#FF5733] group-hover:border-[#FF5733]/30 transition-all">
                                   {team.name.substring(0, 2).toUpperCase()}
                                </div>
                                <span className="text-[13px] font-medium text-gray-400 group-hover:text-[#FF5733] transition-colors">{team.name}</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                                <UsersIcon className="w-3 h-3" />
                                {team.members?.length || 0}
                             </div>
                          </div>
                        ))}
                     </div>
                  </section>
                  {analytics?.mostActiveThreads?.length > 0 && (
                    <section className="card-noir mt-6">
                      <div className="flex items-center gap-2 mb-6">
                         <Activity className="w-4 h-4 text-[#FF5733]" />
                         <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Most Active</h3>
                      </div>
                      <div className="space-y-2">
                        {analytics.mostActiveThreads.map((t: any) => (
                           <Link key={t.id} href={`/dashboard/thread/${t.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FF5733]/5 transition-all group border border-transparent hover:border-[#FF5733]/20">
                             <span className="text-[13px] font-medium text-gray-400 group-hover:text-[#FF5733] truncate max-w-[150px] transition-colors">{t.title}</span>
                             <span className="text-[10px] font-bold text-[#FF5733] bg-[#FF5733]/10 px-2 py-1 rounded-lg">{t.messageCount} msgs</span>
                           </Link>
                        ))}
                      </div>
                    </section>
                  )}
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* NEW THREAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div 
             className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
             onClick={() => setShowModal(false)}
           />
           <div className="w-full max-w-lg bg-[#0e0e0e] border border-white/[0.08] shadow-2xl rounded-2xl p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300 relative z-10 overflow-hidden">
              {/* Subtle ambient glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5733]/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF5733]/5 blur-[60px] rounded-full pointer-events-none" />
              
              {!isCreatingTeam ? (
                <>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                       <h2 className="text-2xl font-bold tracking-tight text-white mb-1">New Thread</h2>
                       <p className="text-xs text-gray-500 font-medium">Create a new context namespace for your architecture.</p>
                    </div>
                    <button 
                      onClick={() => setShowModal(false)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all cursor-pointer shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateThread} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Workspace</label>
                       <div className="flex gap-2">
                          <div className="relative flex-1 group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 group-focus-within:text-[#FF5733] transition-colors">
                               <UsersIcon className="w-4 h-4" />
                            </div>
                            <select 
                              required
                              className="w-full bg-[#050505] border border-white/[0.06] text-white pl-11 pr-10 py-3.5 rounded-xl font-medium text-[13px] appearance-none focus:outline-none focus:border-[#444444] focus:bg-[#0a0a0a] focus:ring-4 focus:ring-white/[0.02] transition-all cursor-pointer"
                              value={selectedTeamId}
                              onChange={(e) => setSelectedTeamId(e.target.value)}
                            >
                               {teams.length === 0 && <option value="">No teams available</option>}
                               {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                            </select>
                            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none rotate-90" />
                          </div>
                          <button 
                            type="button"
                            onClick={() => setIsCreatingTeam(true)}
                            className="px-5 bg-white/[0.03] border border-white/[0.06] text-[11px] font-bold text-white uppercase tracking-widest rounded-xl hover:bg-[#FF5733] hover:text-black hover:border-[#FF5733] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 shrink-0"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            New
                          </button>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Thread Title</label>
                       <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 group-focus-within:text-[#FF5733] transition-colors">
                             <Hash className="w-4 h-4" />
                          </div>
                          <input
                            autoFocus
                            required
                            type="text"
                            placeholder="e.g. Auth Architecture v2"
                            className="w-full bg-[#050505] border border-white/[0.06] text-white pl-11 pr-4 py-3.5 rounded-xl font-medium text-[13px] focus:outline-none focus:border-[#444444] focus:bg-[#0a0a0a] focus:ring-4 focus:ring-white/[0.02] transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Context & Abstract <span className="text-gray-600 lowercase tracking-normal font-medium">(Optional)</span></label>
                       <div className="relative group">
                          <div className="absolute left-4 top-4 flex items-center justify-center text-gray-500 group-focus-within:text-[#FF5733] transition-colors">
                             <AlignLeft className="w-4 h-4" />
                          </div>
                          <textarea
                            placeholder="What high-level context are we capturing?"
                            className="w-full bg-[#050505] border border-white/[0.06] text-white pl-11 pr-4 py-3.5 rounded-xl font-medium text-[13px] h-28 resize-none focus:outline-none focus:border-[#444444] focus:bg-[#0a0a0a] focus:ring-4 focus:ring-white/[0.02] transition-all"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button 
                         type="button"
                         onClick={() => setShowModal(false)}
                         className="flex-1 h-12 bg-white/[0.03] border border-white/[0.06] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all rounded-xl cursor-pointer"
                       >
                         Cancel
                       </button>
                       <button 
                         disabled={submitting || (teams.length === 0 && !isCreatingTeam)}
                         type="submit"
                         className="flex-[2] h-12 bg-[#FF5733] text-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#ff6c4d] transition-all rounded-xl shadow-[0_0_20px_rgba(255,87,51,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                       >
                         {submitting ? (
                           <>
                             <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                             Deploying...
                           </>
                         ) : (
                           "Create Thread"
                         )}
                       </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-white mb-1">New Workspace</h2>
                      <p className="text-gray-500 text-xs font-medium">Group related threads into a single namespace.</p>
                    </div>
                    <button 
                      onClick={() => setIsCreatingTeam(false)} 
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all cursor-pointer shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateTeamInline} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Workspace Name</label>
                       <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 group-focus-within:text-[#FF5733] transition-colors">
                             <UsersIcon className="w-4 h-4" />
                          </div>
                          <input
                            autoFocus
                            required
                            type="text"
                            placeholder="e.g. Core Engineering"
                            className="w-full bg-[#050505] border border-white/[0.06] text-white pl-11 pr-4 py-3.5 rounded-xl font-medium text-[13px] focus:outline-none focus:border-[#444444] focus:bg-[#0a0a0a] focus:ring-4 focus:ring-white/[0.02] transition-all"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                          />
                       </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button 
                         type="button"
                         onClick={() => setIsCreatingTeam(false)}
                         className="flex-1 h-12 bg-white/[0.03] border border-white/[0.06] text-white text-[12px] font-bold uppercase tracking-widest hover:bg-white/[0.08] transition-all rounded-xl cursor-pointer"
                       >
                         Back
                       </button>
                       <button 
                         disabled={submitting}
                         type="submit"
                         className="flex-[2] h-12 bg-[#FF5733] text-black text-[12px] font-bold uppercase tracking-widest hover:bg-[#ff6c4d] transition-all rounded-xl shadow-[0_0_20px_rgba(255,87,51,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                       >
                         {submitting ? (
                           <>
                             <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                             Initializing...
                           </>
                         ) : (
                           "Confirm Workspace"
                         )}
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
