"use client";

import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { 
  Users, 
  Plus, 
  UserPlus, 
  Settings, 
  Activity, 
  Mail, 
  Shield, 
  ChevronRight,
  ChevronLeft,
  Search,
  MoreVertical,
  History,
  Zap,
  Globe,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  const [newTeamName, setNewTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchData();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/v1/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      }
    } catch (e) {}
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/teams");
      if (res.ok) {
        const data = await res.json();
        setTeams(data.teams || []);
      }
    } catch (error) {
      console.error("Failed to fetch team data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTeamName) return;
    setActionLoading(true);
    const toastId = toast.loading("Deploying new team perimeter...");
    try {
      const res = await fetch("/api/v1/teams", {
        method: "POST",
        body: JSON.stringify({ name: newTeamName }),
      });
      if (res.ok) {
        await fetchData();
        setNewTeamName("");
        setShowCreateModal(false);
        toast.success("Team successfully deployed", { id: toastId });
      } else {
        toast.error("Failed to create team", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to create team", error);
      toast.error("An error occurred during deployment", { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleInviteUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !selectedTeamId) return;
    setActionLoading(true);
    const toastId = toast.loading("Transmitting invitation...");
    // Simulation
    setTimeout(() => {
      setActionLoading(false);
      setShowInviteModal(false);
      setInviteEmail("");
      toast.success("Authorization sent to recipient", { id: toastId });
    }, 1000);
  };

  const handleUpdateRole = async (teamId: string, userId: string, newRole: string) => {
    const toastId = toast.loading("Updating authorization level...");
    try {
      const res = await fetch(`/api/v1/teams/${teamId}/members/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        await fetchData();
        toast.success(`Role updated to ${newRole}`, { id: toastId });
      } else {
        toast.error("Failed to update role", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to update role", error);
      toast.error("An error occurred while updating role", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar relative">
          {/* Subtle Background Elements Removed */}

          <div className="max-w-6xl mx-auto w-full relative z-10">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <Link 
                  href="/dashboard" 
                  className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors mb-8"
                >
                  <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  Return to Hub
                </Link>
                <div className="flex items-center gap-4 mb-3">
                   <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                   <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">Team Management</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient">Teams</h1>
              </div>

              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-premium px-8 h-12 shadow-[0_0_20px_rgba(255,87,51,0.15)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </button>
            </header>

            <div className="space-y-8 max-w-5xl mx-auto">
               <InvitationsSection />

               {/* Workspaces List */}
               <div className="space-y-6">
                  {loading ? (
                    Array(2).fill(0).map((_, i) => (
                      <div key={i} className="h-64 rounded-3xl bg-[#FF5733]/10 border border-[#FF5733]/20 animate-pulse" />
                    ))
                  ) : teams.length === 0 ? (
                    <div className="py-32 text-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                       <Users className="w-12 h-12 text-gray-700 mx-auto mb-6 opacity-30" />
                       <p className="text-base font-semibold text-gray-400 uppercase tracking-widest">No active teams detected.</p>
                       <p className="text-sm text-gray-500 mt-2 font-medium">Create a team to begin shared context capture.</p>
                    </div>
                  ) : (
                    teams.map((team) => (
                      <div key={team._id} className="p-8 lg:p-10 bg-[#111111] border border-white/[0.06] rounded-2xl group hover:border-[#FF5733]/30 transition-all duration-300 relative overflow-hidden">
                        
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                           <div>
                              <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#FF5733] transition-colors mb-1">{team.name}</h3>
                              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                                REF: {team.slug}
                              </p>
                           </div>
                           <div className="flex items-center gap-3">
                              <button 
                                onClick={() => { setSelectedTeamId(team._id); setShowInviteModal(true); }}
                                className="h-10 px-6 flex items-center gap-2 bg-[#FF5733] text-black text-[11px] font-bold uppercase tracking-widest rounded hover:bg-[#ff6c4d] transition-all"
                              >
                                <UserPlus className="w-4 h-4" />
                                Invite
                              </button>
                              <Link 
                                href={`/dashboard/teams/${team._id}/settings`}
                                className="h-10 px-4 flex items-center gap-2 border border-white/10 rounded text-gray-400 text-[11px] font-bold uppercase tracking-widest hover:border-[#FF5733]/50 hover:text-[#FF5733] transition-all"
                              >
                                <Settings className="w-4 h-4" />
                                Settings
                              </Link>
                           </div>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {team.members?.map((member: any) => {
                               const isCurrentUser = member.userId === currentUser?.id;
                               const currentMemberInTeam = team.members?.find((m: any) => m.userId === currentUser?.id);
                               const canEdit = currentMemberInTeam?.role === 'ADMIN' && !isCurrentUser;

                               return (
                                  <div key={member.userId} className="p-4 rounded-xl bg-[#0A0A0A] border border-white/[0.04] flex items-center gap-4 hover:border-white/10 transition-all">
                                     <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] flex items-center justify-center text-sm font-bold text-gray-400 uppercase shrink-0">
                                        {member.name?.[0] || 'U'}
                                     </div>
                                     <div className="min-w-0 flex-1">
                                        <h4 className="text-sm font-semibold text-gray-200 truncate">{member.name} {isCurrentUser && "(You)"}</h4>
                                        {canEdit ? (
                                           <select 
                                             value={member.role}
                                             onChange={(e) => handleUpdateRole(team._id, member.userId, e.target.value)}
                                             className="bg-transparent text-[10px] text-[#FF5733] font-bold uppercase tracking-widest border-none p-0 focus:ring-0 cursor-pointer"
                                           >
                                              <option value="ADMIN" className="bg-[#0A0A0A]">ADMIN</option>
                                              <option value="MEMBER" className="bg-[#0A0A0A]">MEMBER</option>
                                              <option value="VIEWER" className="bg-[#0A0A0A]">VIEWER</option>
                                           </select>
                                        ) : (
                                           <p className={`text-[10px] font-bold uppercase tracking-widest ${member.role === 'ADMIN' ? 'text-[#FF5733]' : 'text-gray-500'}`}>
                                              {member.role}
                                           </p>
                                        )}
                                     </div>
                                     {member.role === 'ADMIN' && (
                                        <div className="ml-auto w-2 h-2 rounded-full bg-[#FF5733] shrink-0" />
                                     )}
                                  </div>
                               );
                            })}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
           <div className="w-full max-w-md glass-card p-10 space-y-8 animate-in fade-in zoom-in duration-300 relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5733] via-[#ff6c4d] to-[#FF5733]" />
              <div className="space-y-1">
                 <h2 className="text-2xl font-bold tracking-tight text-white">Initialize Team</h2>
                 <p className="text-gray-400 text-sm font-medium">Create a new secure perimeter for your team.</p>
              </div>

              <form onSubmit={handleCreateTeam} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">Team Name</label>
                    <input
                       autoFocus
                       required
                       type="text"
                       placeholder="e.g. Engineering Team"
                       className="input-noir w-full font-medium text-sm h-12"
                       value={newTeamName}
                       onChange={(e) => setNewTeamName(e.target.value)}
                    />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 h-12 rounded border border-white/10 hover:border-[#FF5733] text-[#FF5733] text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={actionLoading}
                      type="submit"
                      className="flex-[2] h-12 rounded bg-[#FF5733] hover:bg-[#ff6c4d] text-black text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center shadow-[0_0_20px_rgba(255,87,51,0.15)] disabled:opacity-50"
                    >
                      {actionLoading ? "Deploying..." : "Confirm Deployment"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md" onClick={() => setShowInviteModal(false)} />
           <div className="w-full max-w-md glass-card p-10 space-y-8 animate-in fade-in zoom-in duration-300 relative z-10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5733] via-[#ff6c4d] to-[#FF5733]" />
              <div className="space-y-1">
                 <h2 className="text-2xl font-bold tracking-tight text-white">Invite Collaborator</h2>
                 <p className="text-gray-400 text-sm font-medium">Grant access to this team's architectural vault.</p>
              </div>

              <form onSubmit={handleInviteUser} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">Email Address</label>
                      <input
                         autoFocus
                         required
                         type="email"
                         placeholder="partner@company.com"
                         className="input-noir w-full font-medium text-sm px-4 h-12"
                         value={inviteEmail}
                         onChange={(e) => setInviteEmail(e.target.value)}
                      />
                 </div>

                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 h-12 rounded border border-white/10 hover:border-[#FF5733] text-[#FF5733] text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center"
                    >
                      Cancel
                    </button>
                    <button 
                      disabled={actionLoading}
                      type="submit"
                      className="flex-[2] h-12 rounded bg-[#FF5733] hover:bg-[#ff6c4d] text-black text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center shadow-[0_0_20px_rgba(255,87,51,0.15)] disabled:opacity-50"
                    >
                      {actionLoading ? "Transmitting..." : "Send Authorization"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function InvitationsSection() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const res = await fetch("/api/v1/teams/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations || []);
      }
    } catch (err) {
      console.error("Failed to fetch invitations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    const toastId = toast.loading(`${action === 'accept' ? 'Joining' : 'Declining'} team...`);
    try {
      const res = await fetch(`/api/v1/teams/invitations/${id}`, {
        method: action === 'accept' ? 'PATCH' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'accept' ? JSON.stringify({ action: 'accept' }) : undefined
      });
      if (res.ok) {
        toast.success(`Invitation ${action === 'accept' ? 'accepted' : 'declined'}`, { id: toastId });
        fetchInvitations();
        // Trigger a reload of the main teams list if accepted
        if (action === 'accept') window.location.reload();
      } else {
        toast.error(`Failed to ${action} invitation`, { id: toastId });
      }
    } catch (err) {
      console.error(`Failed to ${action} invitation`, err);
      toast.error("An error occurred", { id: toastId });
    }
  };

  if (loading || invitations.length === 0) return null;

  return (
    <section className="glass-card p-8 border-[#FF5733]/30 bg-[#FF5733]/5 animate-in slide-in-from-right duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Mail className="w-4 h-4 text-[#FF5733]" />
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Incoming Requests</h2>
      </div>

      <div className="space-y-4">
        {invitations.map((inv) => (
          <div key={inv._id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-400">Invite to join</p>
              <h4 className="text-[13px] font-bold text-white uppercase tracking-tight">{inv.teamName}</h4>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(inv._id, 'accept')}
                className="flex-1 h-8 bg-[#FF5733] text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-[#ff6c4d] transition-colors"
              >
                Accept
              </button>
              <button 
                onClick={() => handleAction(inv._id, 'reject')}
                className="flex-1 h-8 bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

