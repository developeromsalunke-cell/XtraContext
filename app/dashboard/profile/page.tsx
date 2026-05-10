"use client";

import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";

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
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            <header className="mb-16">
              <Link href="/dashboard" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono hover:text-white transition-colors flex items-center gap-2 mb-10">
                &larr; Return to Hub
              </Link>
              <h1 className="text-4xl font-bold uppercase tracking-tighter mb-4">
                Identity Fragment
              </h1>
              <p className="text-gray-600 text-[11px] font-mono font-bold tracking-widest uppercase">
                User Metadata & Architectural Standing
              </p>
            </header>

            <div className="card-noir overflow-hidden p-0">
              {/* Hero Section */}
              <div className="p-12 border-b border-gray-700 flex items-center gap-12 bg-gray-900">
                <div className="w-24 h-24 rounded bg-white flex items-center justify-center text-black font-black text-3xl font-heading">
                  AD
                </div>
                <div>
                  <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2">{profileData.name}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] font-mono font-bold border border-white/20 px-3 py-1 rounded text-gray-400 uppercase tracking-widest">{profileData.role}</span>
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-widest">{profileData.team}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 border-b border-gray-700">
                {[
                  { label: "Active Threads", value: profileData.activeThreads },
                  { label: "Total Commit Logs", value: profileData.totalLogs.toLocaleString() },
                  { label: "Temporal Standing", value: profileData.joined },
                ].map((stat, i) => (
                  <div key={stat.label} className={`p-10 text-center ${i !== 2 ? 'border-r border-gray-700' : ''}`}>
                    <p className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-4">{stat.label}</p>
                    <p className="text-2xl font-bold uppercase">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Detail Rows */}
              <div className="p-12 space-y-8 bg-black">
                 <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-widest">Email Designation</span>
                    <span className="text-sm font-bold tracking-tight text-white">{profileData.email}</span>
                 </div>
                 <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-widest">System Role</span>
                    <span className="text-sm font-bold tracking-tight text-white">{profileData.role}</span>
                 </div>
                 <div className="flex items-center justify-between pb-6 border-b border-gray-800">
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-widest">Security Clearance</span>
                    <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-gray-800 px-3 py-1 rounded border border-gray-700">LEVEL 4 / ALPHA</span>
                 </div>
              </div>

              <div className="p-10 bg-gray-900 flex justify-end gap-4 border-t border-gray-700">
                 <button className="h-10 px-6 border border-gray-600 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:border-white hover:text-white transition-all rounded">
                   Modify Credentials
                 </button>
                 <button className="h-10 px-6 bg-white text-black font-bold uppercase text-[10px] tracking-widest hover:bg-gray-200 transition-all rounded">
                   Update Identity
                 </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
