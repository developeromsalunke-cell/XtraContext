"use client";

import React, { useState } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Zap, 
  MessageSquare, 
  Edit3, 
  ChevronLeft,
  ArrowRight,
  Check
} from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Aiden Dev",
    email: "aiden@xtracontext.app",
    role: "Lead Architect",
    joined: "May 2026",
    activeThreads: 14,
    totalLogs: 1240,
    team: "Core Infrastructure",
  });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData)
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF5733]/20 border-t-[#FF5733] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar relative">
          <div className="max-w-4xl mx-auto w-full relative z-10">
            <header className="mb-16">
              <Link 
                href="/dashboard" 
                className="group flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors mb-8"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Dashboard
              </Link>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient">My Profile</h1>
            </header>

            <div className="glass-card overflow-hidden">
              {/* Hero Section */}
              <div className="p-12 border-b border-white/[0.05] flex flex-col md:flex-row items-center gap-8 bg-white/[0.02]">
                <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-300 font-bold text-3xl">
                  {profileData.name ? profileData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '?'}
                </div>
                <div className="text-center md:text-left flex-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      className="text-3xl font-bold tracking-tight text-white mb-3 bg-[#111] border border-white/10 rounded-lg px-4 py-2 w-full max-w-sm focus:outline-none focus:border-[#FF5733] transition-colors"
                    />
                  ) : (
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-3">{profileData.name}</h2>
                  )}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="flex items-center gap-2 text-[11px] font-bold bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-gray-300 uppercase tracking-widest">
                       <User className="w-3.5 h-3.5 text-[#FF5733]" />
                       {profileData.role}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-gray-600 uppercase tracking-[0.2em]">{profileData.team}</span>
                  </div>
                </div>
              </div>

              {/* Detail Rows */}
              <div className="p-12 space-y-1 bg-transparent">
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 group gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                       <Mail className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                       <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-300 transition-colors min-w-[120px]">Email</span>
                    </div>
                    <span className="text-sm font-bold text-gray-400">{profileData.email}</span>
                 </div>
                 <div className="h-px bg-white/[0.03]" />
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 group gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                       <User className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                       <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-300 transition-colors min-w-[120px]">Role</span>
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="role"
                        value={profileData.role}
                        onChange={handleChange}
                        className="text-sm font-bold text-white bg-[#111] border border-white/10 rounded-lg px-4 py-2 w-full sm:max-w-sm focus:outline-none focus:border-[#FF5733] transition-colors"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">{profileData.role}</span>
                    )}
                 </div>
                 <div className="h-px bg-white/[0.03]" />
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 group gap-4 sm:gap-0">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                       <span className="text-sm font-semibold text-gray-500 group-hover:text-gray-300 transition-colors min-w-[120px]">Team</span>
                    </div>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="team"
                        value={profileData.team}
                        onChange={handleChange}
                        className="text-sm font-bold text-white bg-[#111] border border-white/10 rounded-lg px-4 py-2 w-full sm:max-w-sm focus:outline-none focus:border-[#FF5733] transition-colors"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white">{profileData.team}</span>
                    )}
                 </div>
              </div>

              <div className="p-10 bg-white/[0.02] flex flex-col md:flex-row justify-end gap-4 border-t border-white/[0.05]">
                 {!isEditing ? (
                   <button 
                     onClick={() => setIsEditing(true)}
                     className="h-12 px-8 border border-white/10 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:border-[#FF5733] hover:text-[#FF5733] transition-all rounded flex items-center justify-center gap-2"
                   >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Profile
                   </button>
                 ) : (
                   <>
                     <button 
                       onClick={() => setIsEditing(false)}
                       className="h-12 px-8 border border-white/10 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:border-white hover:text-white transition-all rounded flex items-center justify-center gap-2"
                     >
                        Cancel
                     </button>
                     <button 
                       onClick={handleSave}
                       className="h-12 px-8 bg-[#FF5733] text-black font-bold uppercase text-[11px] tracking-widest hover:bg-[#ff6c4d] transition-all rounded flex items-center justify-center gap-2"
                     >
                        Save Changes
                        <Check className="w-4 h-4" />
                     </button>
                   </>
                 )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
