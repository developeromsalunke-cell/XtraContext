"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";

export default function TeamSettingsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    fetchTeam();
  }, [id]);

  const fetchTeam = async () => {
    try {
      const res = await fetch("/api/v1/teams");
      if (res.ok) {
        const data = await res.json();
        const foundTeam = data.teams.find((t: any) => t._id === id);
        if (foundTeam) {
          setTeam(foundTeam);
          setTeamName(foundTeam.name);
        } else {
          router.push("/dashboard/teams");
        }
      }
    } catch (error) {
      console.error("Failed to fetch team", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    // Simulation: In a real app, this calls a PATCH /api/v1/teams/[id]
    setTimeout(() => {
      alert("Team settings updated successfully.");
      setUpdating(false);
    }, 1000);
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
              <Link href="/dashboard/teams" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono hover:text-white transition-colors flex items-center gap-2 mb-10">
                &larr; Back to Teams
              </Link>
              <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">Team Settings</h1>
              <p className="text-gray-400 text-[11px] font-mono font-bold tracking-widest uppercase">Configuration protocol for {team?.name}</p>
            </header>

            <div className="space-y-12">
              {/* Team Identity */}
              <section className="card-noir border-gray-700 bg-gray-900">
                <h2 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-8">Team Identity</h2>
                <form onSubmit={handleUpdateName} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">Team Name</label>
                    <input
                      type="text"
                      className="input-noir w-full uppercase font-mono text-xs"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      disabled={updating}
                      type="submit"
                      className="h-10 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </section>

              {/* Members Management */}
              <section className="card-noir border-gray-700 bg-gray-900">
                <h2 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-8">Member Administration</h2>
                <div className="divide-y divide-gray-800">
                  {team?.members?.map((member: any) => (
                    <div key={member.userId} className="py-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-black border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-white group-hover:text-black transition-all">
                          {member.name?.[0] || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white uppercase tracking-tight truncate">{member.name}</p>
                          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold truncate">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest font-bold">{member.role}</span>
                         {member.role !== 'ADMIN' && (
                           <button className="text-[10px] font-bold text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors">
                             Remove
                           </button>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Integration Protocols */}
              <section className="card-noir border-gray-700 bg-gray-900">
                <h2 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-8">Integration Protocol</h2>
                <div className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest font-mono">Team ID (Required for MCP)</label>
                      <div className="flex gap-3">
                         <input
                           readOnly
                           type="text"
                           className="input-noir flex-1 font-mono text-xs text-gray-400"
                           value={team?._id}
                         />
                         <button 
                           onClick={() => { navigator.clipboard.writeText(team?._id); alert("Copied!"); }}
                           className="px-4 border border-gray-700 rounded-md text-[10px] font-bold uppercase tracking-widest hover:border-white transition-all"
                         >
                           Copy
                         </button>
                      </div>
                   </div>
                   <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                      Use this ID when configuring your external AI agents to point to this specific team's memory vault. 
                   </p>
                </div>
              </section>

              {/* Danger Zone */}
              <section className="card-noir border-red-500/20 bg-red-500/5">
                 <h2 className="text-[11px] font-mono font-bold text-red-500/60 uppercase tracking-widest mb-8">Danger Zone</h2>
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                       <p className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Decommission Team</p>
                       <p className="text-xs text-gray-500 font-medium">Permanently delete this team and all associated thread history.</p>
                    </div>
                    <button className="h-10 px-8 border border-red-500/40 text-red-400 text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-red-500 hover:text-white transition-all">
                       Delete Team
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
