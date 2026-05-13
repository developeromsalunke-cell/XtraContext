"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Key, 
  Settings, 
  LogOut,
  Search,
  Shield,
  PanelLeftClose,
  PanelLeft,
  BookOpen,
  Bot,
  Network,
  History,
  Activity,
  Clock,
  Sparkles
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);
  const [profileData, setProfileData] = React.useState({ name: "Loading..." });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.name) {
            setProfileData(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch profile in sidebar", error);
      }
    }
    loadProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name || name === "Loading...") return "--";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "AI Assistant", href: "/dashboard/ai", icon: Bot },
    { label: "All Threads", href: "/dashboard/conversations", icon: MessageSquare },
    { label: "Knowledge Graph", href: "/dashboard/graph", icon: Network },
    { label: "Timeline", href: "/dashboard/timeline", icon: History },
    { label: "Synthesis", href: "/dashboard/synthesis", icon: Sparkles },
    { label: "Teams", href: "/dashboard/teams", icon: Users },
    { label: "API Keys", href: "/dashboard/settings/keys", icon: Key },
    { label: "Documentation", href: "/dashboard/docs", icon: BookOpen },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <aside 
      className={`${collapsed ? 'w-[72px]' : 'w-[260px]'} bg-[#0e0e0e] border-r border-white/[0.06] flex flex-col h-screen shrink-0 font-sans transition-[width] duration-300 ease-in-out relative z-50 overflow-hidden whitespace-nowrap`}
    >
      {/* Header */}
      <div className={`h-[84px] flex items-center shrink-0 ${collapsed ? 'justify-center px-0' : 'pl-[18px] pr-3 justify-between'}`}>
        <Link href="/" className={`flex items-center gap-3 group ${collapsed ? 'hidden' : 'flex'}`}>
          <div className="w-8 h-8 bg-[#FF5733] flex items-center justify-center rounded-lg shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-black font-black text-base leading-none">X</span>
          </div>
          <span className="text-[15px] font-bold tracking-tight text-white uppercase leading-none">
            XtraContext
          </span>
        </Link>
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`flex items-center justify-center rounded-lg text-gray-500 hover:text-white transition-all shrink-0 ${collapsed ? 'w-10 h-10 hover:bg-white/[0.04]' : 'w-8 h-8 hover:bg-white/[0.04]'}`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-[18px] h-[18px]" />}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6 px-[18px] shrink-0">
        <div 
          className={`cursor-pointer bg-white/[0.03] border border-white/[0.06] rounded-lg h-9 flex items-center hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 relative overflow-hidden ${collapsed ? 'w-9' : 'w-[224px]'}`}
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          title="Search (⌘K)"
        >
          <div className="absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center">
            <Search className="w-4 h-4 text-gray-600 shrink-0" />
          </div>
          <span className={`absolute left-9 text-[13px] font-medium text-gray-500 transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            Search...
          </span>
          <kbd className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-gray-600 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5 shrink-0 transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar overflow-x-hidden pt-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            const Icon = item.icon;
            return (
              <div key={item.href} className="px-[18px]">
                <Link
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={`flex items-center h-10 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "text-[#FF5733] bg-[#FF5733]/10"
                      : "text-gray-500 hover:text-white hover:bg-white/[0.04]"
                  } ${collapsed ? 'w-9' : 'w-[224px]'}`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#FF5733] rounded-r-full shrink-0" />
                  )}
                  <div className="absolute left-[9px] top-1/2 -translate-y-1/2 flex items-center">
                    <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#FF5733]' : ''}`} />
                  </div>
                  <span className={`absolute left-10 transition-opacity duration-300 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-[18px] pb-6 space-y-3 border-t border-white/[0.06] shrink-0">

        {/* User Profile */}
        <div className={`flex items-center bg-white/[0.02] border border-white/[0.06] rounded-xl transition-all duration-300 relative overflow-hidden ${collapsed ? 'w-9 h-9 p-0.5' : 'w-[224px] h-[46px] p-1.5'}`}>
          <Link 
            href="/dashboard/profile" 
            className={`flex items-center h-full rounded-lg hover:bg-white/[0.04] transition-all ${collapsed ? 'w-full justify-center' : 'w-[180px] px-1.5 gap-3'}`}
            title={collapsed ? profileData.name : undefined}
          >
            <div className={`flex items-center justify-center rounded-lg text-[10px] font-bold text-[#FF5733] shrink-0 transition-all duration-300 bg-[#FF5733]/10 border border-[#FF5733]/30 ${collapsed ? 'w-7 h-7' : 'w-8 h-8'}`}>
               {getInitials(profileData.name)}
            </div>
            <div className={`flex-1 min-w-0 transition-opacity duration-300 ${collapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
              <p className="text-sm font-semibold text-white truncate leading-tight">{profileData.name}</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0 cursor-pointer ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
