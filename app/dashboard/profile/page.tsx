"use client";

import Link from "next/link";

export default function ProfilePage() {
  const profileData = {
    name: "Aiden Dev",
    email: "aiden@xtracontext.app",
    role: "Lead Architect",
    joined: "May 2026",
    activeThreads: 14,
    totalLogs: 1240,
    team: "Core Infrastructure",
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-12 bg-noir-grid">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20">
          <Link href="/dashboard" className="mono-label text-foreground/40 hover:text-foreground transition-colors mb-8 inline-block uppercase tracking-widest text-[10px]">
            &larr; Return to Hub
          </Link>
          <h1 className="text-6xl font-heading font-black uppercase tracking-tighter mb-4">
            Identity Fragment
          </h1>
          <p className="mono-label text-foreground/40 uppercase tracking-[0.3em] text-xs">
            User Metadata & Architectural Standing
          </p>
        </header>

        <div className="border border-foreground/10 bg-background noir-card overflow-hidden">
          {/* Hero Section */}
          <div className="p-16 border-b border-foreground/10 flex items-center gap-16">
            <div className="w-32 h-32 bg-foreground flex items-center justify-center grayscale">
              <span className="text-4xl font-heading font-black text-background">AD</span>
            </div>
            <div>
              <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">{profileData.name}</h2>
              <div className="flex items-center gap-4">
                <span className="mono-label px-3 py-1 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest">{profileData.role}</span>
                <span className="mono-label text-foreground/30 text-[10px] uppercase tracking-widest">{profileData.team}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10">
            {[
              { label: "Active Threads", value: profileData.activeThreads },
              { label: "Total Commit Logs", value: profileData.totalLogs.toLocaleString() },
              { label: "Temporal Standing", value: profileData.joined },
            ].map((stat) => (
              <div key={stat.label} className="bg-background p-12 text-center">
                <p className="mono-label text-foreground/30 text-[10px] uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <p className="text-3xl font-heading font-black uppercase">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Detail Rows */}
          <div className="p-12 space-y-8">
             <div className="flex items-center justify-between py-6 border-b border-foreground/5">
                <span className="mono-label text-foreground/40 uppercase text-[10px] tracking-widest">Email Designation</span>
                <span className="font-heading font-bold uppercase tracking-wider">{profileData.email}</span>
             </div>
             <div className="flex items-center justify-between py-6 border-b border-foreground/5">
                <span className="mono-label text-foreground/40 uppercase text-[10px] tracking-widest">System Role</span>
                <span className="font-heading font-bold uppercase tracking-wider">{profileData.role}</span>
             </div>
             <div className="flex items-center justify-between py-6 border-b border-foreground/5">
                <span className="mono-label text-foreground/40 uppercase text-[10px] tracking-widest">Security Clearance</span>
                <span className="font-heading font-bold uppercase tracking-wider text-green-500/80">LEVEL 4 / ALPHA</span>
             </div>
          </div>

          <div className="p-12 bg-foreground/5 flex justify-end gap-6">
             <button className="px-10 py-4 border border-foreground/10 mono-label text-foreground/40 uppercase text-[10px] tracking-widest hover:text-foreground transition-all">
               Edit Profile
             </button>
             <button className="px-10 py-4 bg-foreground text-background font-black uppercase text-[10px] tracking-widest hover:invert transition-all">
               Update Identity
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
