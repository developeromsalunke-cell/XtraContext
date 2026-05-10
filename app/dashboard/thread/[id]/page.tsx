"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { useParams } from "next/navigation";

export default function ThreadDetailPage() {
  const { id } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const res = await fetch(`/api/v1/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setThread(data.conversation);
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Failed to fetch thread", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900 shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="h-4 w-px bg-gray-700" />
              <div>
                <h1 className="text-sm font-bold tracking-tight truncate max-w-[300px]">
                  {loading ? "Loading Thread..." : thread?.title || "Untitled Thread"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button className="h-9 px-4 border border-gray-600 text-[11px] font-bold uppercase tracking-widest rounded-md hover:border-white transition-colors text-gray-300 hover:text-white">
                  Export Markdown
               </button>
               <button className="h-9 px-4 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors">
                  Sync History
               </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* Chat Timeline */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-16">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="space-y-6 animate-pulse">
                      <div className="h-4 w-24 bg-gray-800 rounded" />
                      <div className="h-32 w-full bg-gray-900 rounded-lg" />
                    </div>
                  ))
                ) : messages.length === 0 ? (
                  <div className="py-40 text-center border border-dashed border-gray-700 rounded-lg">
                    <p className="text-gray-400 text-xs font-mono uppercase tracking-[0.3em] font-bold">No chat logs found in this thread.</p>
                  </div>
                ) : (
                  messages.map((msg: any, i: number) => (
                    <div key={i} className="group">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-black ${msg.role === 'user' ? 'bg-gray-700 text-white' : 'bg-white text-black shadow-lg'}`}>
                          {msg.role === 'user' ? 'U' : 'AI'}
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                              {msg.role === 'user' ? 'You' : (thread?.model || 'AI Assistant')}
                           </span>
                           <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                              {new Date(msg.timestamp || Date.now()).toLocaleTimeString()}
                           </span>
                        </div>
                      </div>
                      
                      <div className={`text-[15px] leading-relaxed ${msg.role === 'user' ? 'text-gray-300' : 'text-white'} font-medium`}>
                        {msg.content}
                      </div>

                      {msg.code && (
                        <div className="mt-8 rounded-lg border border-gray-700 bg-gray-900 overflow-hidden">
                          <div className="px-5 py-2 border-b border-gray-700 bg-gray-800 flex items-center justify-between">
                             <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">Code Snippet</span>
                             <button className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-widest">Copy</button>
                          </div>
                          <pre className="p-6 font-mono text-xs text-gray-300 overflow-x-auto leading-relaxed">
                            <code>{msg.code}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sidebar Details */}
            <aside className="w-80 border-l border-gray-800 bg-gray-900 p-10 hidden xl:block overflow-y-auto custom-scrollbar">
               <div className="space-y-12">
                  <section>
                     <h3 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-6">Thread Info</h3>
                     <div className="space-y-6">
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">AI Model</span>
                           <span className="text-xs font-bold text-white uppercase">{thread?.model || "Standard Node"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Total Tokens</span>
                           <span className="text-xs font-bold text-white uppercase">{thread?.tokenCount?.toLocaleString() || "Calculated on sync"}</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                           <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Captured On</span>
                           <span className="text-xs font-bold text-white uppercase">
                              {thread?.createdAt ? new Date(thread.createdAt).toLocaleDateString() : "Pending"}
                           </span>
                        </div>
                     </div>
                  </section>

                  {thread?.tags && thread.tags.length > 0 && (
                    <>
                      <div className="h-px bg-gray-800" />
                      <section>
                        <h3 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-6">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {thread.tags.map((tag: string) => (
                              <span key={tag} className="px-3 py-1 bg-black border border-gray-700 rounded text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                                  {tag}
                              </span>
                            ))}
                        </div>
                      </section>
                    </>
                  )}

                  <div className="h-px bg-gray-800" />

                  <section>
                     <h3 className="text-[11px] font-mono font-bold text-gray-300 uppercase tracking-widest mb-6">System Status</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                           <span className="text-gray-400 font-bold">Memory Sync</span>
                           <span className="text-white font-bold">Active</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                           <span className="text-gray-400 font-bold">Vector State</span>
                           <span className="text-white font-bold">Indexed</span>
                        </div>
                     </div>
                  </section>
               </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
