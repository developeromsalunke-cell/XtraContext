"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [teamsRes, activityRes] = await Promise.all([
        fetch("/api/v1/teams"),
        fetch("/api/v1/teams/activity")
      ]);

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData.teams || []);
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setActivities(activityData.activities || []);
      }
    } catch (error) {
      console.error("Failed to fetch team data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/v1/teams", {
        method: "POST",
        body: JSON.stringify({ name: newTeamName }),
      });
      if (res.ok) {
        await fetchData();
        setNewTeamName("");
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("Failed to create team", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !selectedTeamId) return;
    setActionLoading(true);
    // Simulation: In a real app, this calls an invite API
    setTimeout(() => {
      alert(`Invitation sent to ${inviteEmail}`);
      setActionLoading(false);
      setShowInviteModal(false);
      setInviteEmail("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto w-full">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">Teams</h1>
                <p className="text-gray-400 text-[11px] font-mono font-bold tracking-widest uppercase">Manage your team members and shared projects</p>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="h-11 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
              >
                Create New Team
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
               {/* Activity Sidebar */}
               <div className="lg:col-span-4 order-2 lg:order-1">
                  <section className="card-noir border-gray-700">
                     <div className="flex items-center justify-between mb-8">
                        <h2 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest">Team Activity</h2>
                        {activities.length > 0 && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                     </div>

                     <div className="space-y-10">
                        {activities.length === 0 ? (
                           <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest font-bold">No recent events.</p>
                        ) : (
                          activities.map((activity, i) => (
                             <div key={i} className="space-y-1">
                                <p className="text-[13px] leading-relaxed text-gray-300">
                                   <span className="text-white font-bold">{activity.user}</span> {activity.action}: <span className="font-bold">"{activity.title}"</span>
                                </p>
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                                   {new Date(activity.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                             </div>
                          ))
                        )}
                     </div>
                  </section>
               </div>

               {/* Teams List */}
               <div className="lg:col-span-8 order-1 lg:order-2 space-y-6">
                  {loading ? (
                    Array(2).fill(0).map((_, i) => (
                      <div key={i} className="h-48 rounded-lg bg-gray-900 border border-gray-700 animate-pulse" />
                    ))
                  ) : teams.length === 0 ? (
                    <div className="py-32 text-center border border-dashed border-gray-700 rounded-lg">
                       <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest font-bold">No teams identified.</p>
                    </div>
                  ) : (
                    teams.map((team) => (
                      <div key={team._id} className="card-noir">
                        <div className="flex items-center justify-between mb-8">
                           <div>
                              <h3 className="text-2xl font-bold uppercase tracking-tighter mb-2">{team.name}</h3>
                              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">ID: {team.slug}</p>
                           </div>
                           <div className="flex gap-2">
                              <button 
                                onClick={() => { setSelectedTeamId(team._id); setShowInviteModal(true); }}
                                className="text-[10px] font-bold uppercase tracking-widest text-white bg-gray-800 px-4 py-1.5 rounded-md hover:bg-gray-700 transition-colors"
                              >
                                Invite
                              </button>
                              <Link 
                                href={`/dashboard/teams/${team._id}/settings`}
                                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-700 px-4 py-1.5 rounded-md hover:border-white hover:text-white transition-colors flex items-center"
                              >
                                Settings
                              </Link>
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {team.members?.map((member: any) => (
                              <div key={member.userId} className="p-4 rounded-md bg-black border border-gray-700 flex items-center justify-between group hover:border-gray-500 transition-all">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-300 group-hover:bg-white group-hover:text-black transition-all">
                                       {member.name?.[0] || 'U'}
                                    </div>
                                    <div className="min-w-0">
                                       <h4 className="text-sm font-bold text-white uppercase tracking-tight truncate">{member.name}</h4>
                                       <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">{member.role}</p>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="w-full max-w-md card-noir bg-gray-900 border-gray-700 p-10 space-y-8 animate-in fade-in zoom-in duration-200">
              <div className="space-y-2">
                 <h2 className="text-2xl font-bold uppercase tracking-tight">Create Team</h2>
                 <p className="text-gray-400 text-sm font-medium">Start a new shared workspace for your project.</p>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Team Name</label>
                    <input
                       autoFocus
                       required
                       type="text"
                       placeholder="E.G. CORE INFRASTRUCTURE"
                       className="input-noir w-full uppercase font-mono text-xs"
                       value={newTeamName}
                       onChange={(e) => setNewTeamName(e.target.value)}
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 h-12 border border-gray-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={actionLoading}
                      type="submit"
                      className="flex-1 h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? "Creating..." : "Create"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="w-full max-w-md card-noir bg-gray-900 border-gray-700 p-10 space-y-8 animate-in fade-in zoom-in duration-200">
              <div className="space-y-2">
                 <h2 className="text-2xl font-bold uppercase tracking-tight">Invite Member</h2>
                 <p className="text-gray-400 text-sm font-medium">Invite a collaborator to join your team.</p>
              </div>

              <form onSubmit={handleInviteUser} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Email Address</label>
                    <input
                       autoFocus
                       required
                       type="email"
                       placeholder="PARTNER@COMPANY.COM"
                       className="input-noir w-full font-mono text-xs"
                       value={inviteEmail}
                       onChange={(e) => setInviteEmail(e.target.value)}
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 h-12 border border-gray-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={actionLoading}
                      type="submit"
                      className="flex-1 h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? "Sending..." : "Send Invite"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
