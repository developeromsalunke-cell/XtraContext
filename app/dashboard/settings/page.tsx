"use client";

import React from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  Key, 
  Shield, 
  Settings, 
  Database, 
  ChevronRight, 
  Lock, 
  Layout, 
  Trash2, 
  Download,
  Users,
  ChevronLeft
} from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Security & Access",
      icon: Shield,
      color: "text-[#FF5733]",
      description: "Manage how external agents connect to your architectural memory.",
      links: [
        { name: "Access Tokens", href: "/dashboard/settings/keys", icon: Key, description: "Issue and revoke xc_ tokens for MCP servers." },
        { name: "Authentication", href: "#", icon: Lock, description: "Configure 2FA and session security." },
      ]
    },
    {
      title: "Workspace Prefs",
      icon: Layout,
      color: "text-[#FF5733]",
      description: "Configure the visual and structural environment of XtraContext.",
      links: [
        { name: "Design System", href: "#", icon: Settings, description: "Toggle between high-contrast noir variants." },
        { name: "Team Settings", href: "/dashboard/teams", icon: Users, description: "Manage members and organizational slugs." },
      ]
    },
    {
      title: "Data Management",
      icon: Database,
      color: "text-[#FF5733]",
      description: "Control your contextual data and thread archives.",
      links: [
        { name: "Export Archive", href: "#", icon: Download, description: "Download your entire architectural history." },
        { name: "Pruning Policy", href: "#", icon: Trash2, description: "Set automated thread deletion rules." },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar relative">
          {/* Subtle Background Elements Removed */}

          <div className="max-w-6xl mx-auto w-full relative z-10">
            <header className="mb-16">
              <Link 
                href="/dashboard" 
                className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors mb-8"
              >
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                Return to Hub
              </Link>
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                 <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">System Parameters</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient">Settings</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.title} className="glass-card p-10 flex flex-col h-full group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                       <div className={`w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center ${section.color}`}>
                          <Icon className="w-5 h-5" />
                       </div>
                       <h2 className="text-xl font-bold tracking-tight text-white">{section.title}</h2>
                    </div>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed mb-10">{section.description}</p>
                    
                    <div className="mt-auto space-y-4">
                      {section.links.map((link) => {
                        const LinkIcon = link.icon;
                        return (
                          <Link href={link.href} key={link.name} className="block group/link">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group-hover/link:bg-white/[0.05] group-hover/link:border-white/10 transition-all">
                              <div className="flex items-center gap-3">
                                 <LinkIcon className="w-4 h-4 text-gray-500 group-hover/link:text-white transition-colors" />
                                 <div>
                                    <span className="text-[13px] font-bold text-gray-300 group-hover/link:text-white transition-colors block">{link.name}</span>
                                    <p className="text-[10px] text-gray-600 font-medium mt-0.5">{link.description}</p>
                                 </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-700 group-hover/link:text-white transition-all transform group-hover/link:translate-x-1" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 opacity-30">
               <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">XtraContext Engine v1.4.2</p>
               <div className="flex items-center gap-6">
                  <Link href="#" className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Documentation</Link>
                  <Link href="#" className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Support</Link>
               </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
