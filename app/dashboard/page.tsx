"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newThread, setNewThread] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/v1/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Failed to fetch threads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThread),
      });
      if (res.ok) {
        const data = await res.json();
        setIsModalOpen(false);
        router.push(`/dashboard/thread/${data.conversationId}`);
      }
    } catch (error) {
      console.error("Failed to create thread", error);
    }
  };

  const filteredThreads = conversations.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20 bg-noir-grid">
      <div className="flex h-screen relative z-10">
        {/* Sidebar */}
        <aside className="w-72 border-r border-foreground/10 bg-background flex flex-col p-8">
          <div className="flex items-center gap-4 mb-16">
            <div className="w-10 h-10 bg-foreground flex items-center justify-center">
              <span className="text-background font-black text-lg font-heading">CV</span>
            </div>
            <span className="font-heading font-black text-2xl tracking-tighter uppercase">Vault</span>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { name: "Active Threads", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", active: true, href: "/dashboard" },
              { name: "Context Logs", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", active: false, href: "#" },
              { name: "Access Tokens", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z", active: false, href: "/dashboard/settings/keys" },
              { name: "Config", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z", active: false, href: "/dashboard/settings" },
            ].map((item) => (
              <Link href={item.href} key={item.name} className={`w-full flex items-center gap-4 px-4 py-4 transition-all text-left group ${item.active ? 'bg-foreground text-background' : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'}`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="text-sm font-medium uppercase tracking-wider">{item.name}</span>
              </Link>
            ))}
          </nav>

          <Link href="/dashboard/profile" className="mt-auto pt-8 border-t border-foreground/10 flex items-center gap-4 group cursor-pointer">
            <div className="w-10 h-10 border border-foreground/20 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
              <div className="w-6 h-6 bg-foreground/10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-foreground/80 transition-colors">Aiden Dev</span>
              <span className="text-[10px] mono-label text-foreground/40 uppercase">Architect Plan</span>
            </div>
          </Link>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-24 border-b border-foreground/10 flex items-center justify-between px-12 bg-background">
            <div className="flex-1 max-w-2xl relative">
              <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVE..." 
                className="w-full bg-transparent py-4 pl-10 pr-4 text-sm font-mono focus:outline-none placeholder:text-foreground/20 uppercase tracking-widest"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-8">
              <button className="text-foreground/30 hover:text-foreground transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-foreground text-background px-8 py-3 font-black text-xs uppercase tracking-[0.2em] hover:bg-foreground/90 transition-all flex items-center gap-3"
              >
                <span>Initialize Thread</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-12 bg-background">
            <div className="flex items-end justify-between mb-16">
              <div>
                <h2 className="text-5xl font-heading font-black tracking-tighter uppercase mb-2">Workspace</h2>
                <div className="h-1 w-24 bg-foreground" />
              </div>
              <div className="flex items-center gap-6 mono-label text-foreground/40">
                <span className="text-foreground font-black border-b-2 border-foreground pb-1">All Threads</span>
                <span className="hover:text-foreground transition-colors cursor-pointer pb-1">Pinned</span>
                <span className="hover:text-foreground transition-colors cursor-pointer pb-1">Archived</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 border border-foreground/10 bg-foreground/[0.02] animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
                {filteredThreads.length === 0 ? (
                  <div className="col-span-full py-40 text-center bg-background">
                    <h3 className="text-2xl font-heading font-black uppercase mb-4 opacity-10">Void</h3>
                    <p className="text-xs mono-label text-foreground/30">No memory fragments found in this sector.</p>
                  </div>
                ) : (
                  filteredThreads.map((thread) => (
                    <Link href={`/dashboard/thread/${thread._id || thread.id}`} key={thread._id || thread.id} className="block group">
                      <div className="h-64 p-10 bg-background hover:bg-foreground/[0.02] transition-all flex flex-col">
                        <div className="flex items-start justify-between mb-8">
                          <span className="mono-label px-3 py-1 border border-foreground/10 text-foreground/40 group-hover:border-foreground/30 transition-all">
                            ID: {(thread._id || thread.id).slice(0, 8)}
                          </span>
                          <div className="w-2 h-2 bg-foreground" />
                        </div>

                        <h3 className="text-xl font-heading font-black uppercase mb-3 line-clamp-1 group-hover:tracking-wider transition-all">{thread.title}</h3>
                        <p className="text-sm text-foreground/40 line-clamp-2 mb-auto leading-relaxed">
                          {thread.description || "NO ARCHITECTURAL NOTES PROVIDED."}
                        </p>

                        <div className="flex items-center justify-between pt-8 border-t border-foreground/5 mt-auto">
                          <span className="text-[10px] mono-label text-foreground/20 italic">
                            {new Date(thread.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-foreground">{thread.messageCount || 0} LOGS</span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Noir Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/95 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-xl border border-foreground bg-background shadow-[20px_20px_0px_0px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="p-12">
              <div className="flex items-start justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-heading font-black uppercase tracking-tighter">Initialize</h2>
                  <div className="h-1 w-12 bg-foreground mt-2" />
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-foreground/20 hover:text-foreground transition-all">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-10">
                <div className="space-y-4">
                  <label className="mono-label text-foreground/40 block">Designation / Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ENTER THREAD NAME..." 
                    className="w-full bg-transparent border-b-2 border-foreground/10 py-4 text-lg focus:outline-none focus:border-foreground transition-all font-heading font-bold uppercase tracking-widest"
                    value={newThread.title}
                    onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                  />
                </div>

                <div className="space-y-4">
                  <label className="mono-label text-foreground/40 block">Architectural Objective</label>
                  <textarea 
                    rows={3}
                    placeholder="DEFINE THE CONTEXTUAL GOAL..." 
                    className="w-full bg-transparent border-b-2 border-foreground/10 py-4 text-sm focus:outline-none focus:border-foreground transition-all resize-none leading-relaxed"
                    value={newThread.description}
                    onChange={(e) => setNewThread({...newThread, description: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-4 pt-6">
                  <button 
                    type="submit" 
                    className="w-full bg-foreground text-background py-5 font-black uppercase tracking-[0.3em] text-sm hover:invert transition-all"
                  >
                    Commit Thread
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="w-full border border-foreground/10 py-4 mono-label text-foreground/40 hover:text-foreground transition-all"
                  >
                    Abort
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
