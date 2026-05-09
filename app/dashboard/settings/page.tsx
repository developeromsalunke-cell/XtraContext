"use client";

import Link from "next/link";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Security & Access",
      description: "Manage how external agents connect to your architectural memory.",
      links: [
        { name: "Access Tokens", href: "/dashboard/settings/keys", description: "Issue and revoke xc_ tokens for MCP servers." },
        { name: "Authentication", href: "#", description: "Configure 2FA and session security." },
      ]
    },
    {
      title: "Workspace Preferences",
      description: "Configure the visual and structural environment of XtraContext.",
      links: [
        { name: "Design System", href: "#", description: "Toggle between high-contrast noir variants." },
        { name: "Team Settings", href: "#", description: "Manage members and organizational slugs." },
      ]
    },
    {
      title: "Data Management",
      description: "Control your contextual data and thread archives.",
      links: [
        { name: "Export Archive", href: "#", description: "Download your entire architectural history." },
        { name: "Pruning Policy", href: "#", description: "Set automated thread deletion rules." },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-12 bg-noir-grid">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20">
          <Link href="/dashboard" className="mono-label text-foreground/40 hover:text-foreground transition-colors mb-8 inline-block uppercase tracking-widest text-[10px]">
            &larr; Return to Hub
          </Link>
          <h1 className="text-6xl font-heading font-black uppercase tracking-tighter mb-4">
            System Config
          </h1>
          <p className="mono-label text-foreground/40 uppercase tracking-[0.3em] text-xs">
            Global Parameters & Security Protocols
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
          {settingsSections.map((section) => (
            <div key={section.title} className="bg-background p-12 flex flex-col h-full border border-foreground/5 hover:bg-foreground/[0.01] transition-all">
              <h2 className="text-2xl font-heading font-black uppercase mb-6 tracking-tight">{section.title}</h2>
              <p className="text-xs mono-label text-foreground/40 mb-12 leading-relaxed uppercase tracking-widest">{section.description}</p>
              
              <div className="mt-auto space-y-6">
                {section.links.map((link) => (
                  <Link href={link.href} key={link.name} className="block group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-heading font-bold uppercase text-sm group-hover:tracking-widest transition-all">{link.name}</span>
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-[10px] mono-label text-foreground/30">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
