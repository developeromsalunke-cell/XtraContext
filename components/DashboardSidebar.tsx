"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "📊" },
    { label: "All Threads", href: "/dashboard/conversations", icon: "💬" },
    { label: "Knowledge Graph", href: "/dashboard/graph", icon: "🧠" },
    { label: "My Projects", href: "/dashboard/projects", icon: "📁" },
    { label: "Team Members", href: "/dashboard/teams", icon: "👥" },
    { label: "API Keys", href: "/dashboard/settings/keys", icon: "🔑" },
    { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
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
    <aside className="w-60 bg-black border-r border-gray-800 flex flex-col h-screen shrink-0 font-sans transition-colors duration-300">
      <div className="p-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
            <span className="text-black font-black text-lg font-heading">X</span>
          </div>
          <span className="text-lg font-heading font-black tracking-tight text-white uppercase">XtraContext</span>
        </Link>
      </div>

      <div className="px-4 mb-10">
        <div 
          className="relative group cursor-pointer"
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
        >
          <div className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-xs text-gray-500 flex items-center justify-between group-hover:border-gray-500 transition-all">
             <span>Search threads...</span>
             <span className="text-[9px] font-mono font-bold bg-black px-1.5 py-0.5 rounded border border-gray-800">⌘K</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
        <div className="space-y-1">
          <div className="px-4 mb-3">
             <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Navigation</h3>
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
           <div className="px-4 mb-3 flex items-center justify-between">
              <h3 className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Workspaces</h3>
              <button className="text-gray-500 hover:text-white text-sm">+</button>
           </div>
           <div className="space-y-1">
              {["E-commerce", "Mobile App", "API Service"].map((project) => (
                <div key={project} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white cursor-pointer group">
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-white transition-colors" />
                   {project}
                </div>
              ))}
           </div>
        </div>
      </nav>

      <div className="px-4 py-4 space-y-4 border-t border-gray-800 bg-gray-900/40">
        <ThemeToggle />
        
        <div className="flex items-center gap-2">
          <Link href="/dashboard/profile" className="flex-1 flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors group">
            <div className="w-8 h-8 bg-gray-800 border border-gray-700 flex items-center justify-center rounded text-xs font-bold text-gray-300 group-hover:border-white group-hover:text-white transition-all">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Aiden Dev</p>
              <p className="text-[10px] font-semibold text-gray-400 truncate">Credits: 234/1000</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-all border border-transparent hover:border-red-500/20"
            title="Logout"
          >
            <span className="text-sm">🚪</span>
          </button>
        </div>
        
        <div className="mt-2 px-2 pb-2">
           <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[23.4%]" />
           </div>
        </div>
      </div>
    </aside>
  );
}
