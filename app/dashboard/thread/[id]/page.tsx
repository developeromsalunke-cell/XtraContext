"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ThreadDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/v1/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setThread(data.conversation);
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Failed to fetch thread details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-12 h-1 bg-foreground animate-pulse" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-center p-8 border-4 border-foreground">
        <h2 className="text-4xl font-heading font-black uppercase mb-4 tracking-tighter">System Void</h2>
        <p className="mono-label text-foreground/40 mb-12">The requested context fragment does not exist.</p>
        <Link href="/dashboard" className="px-12 py-5 bg-foreground text-background font-black uppercase tracking-[0.3em] text-xs hover:invert transition-all">
          Return to Hub
        </Link>
      </div>
    );
  }

  const totalTokens = messages.reduce((sum, m) => sum + (m.tokenCount || 0), 0);
  const totalCost = messages.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden bg-noir-grid">
      {/* Header */}
      <header className="h-28 border-b border-foreground/10 flex items-center justify-between px-12 bg-background z-20 shrink-0">
        <div className="flex items-center gap-10">
          <Link href="/dashboard" className="w-12 h-12 border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-background transition-all group">
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <div className="flex items-center gap-4 mb-1">
              <h1 className="text-3xl font-heading font-black uppercase tracking-tighter">
                {thread.title}
              </h1>
              <span className="mono-label px-3 py-1 bg-foreground text-background font-bold">LIVE</span>
            </div>
            <div className="flex items-center gap-4 mono-label text-[10px] text-foreground/30 font-mono">
              <span>REF: {thread._id}</span>
              <span className="w-1 h-1 bg-foreground/20 rounded-full" />
              <span className="uppercase tracking-widest">Architectural Context v1.0</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-12 px-10 py-4 border border-foreground/10">
            <div className="text-right">
              <p className="mono-label text-foreground/30 mb-1">Density</p>
              <p className="font-heading font-black text-xl">{totalTokens.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="mono-label text-foreground/30 mb-1">Cost</p>
              <p className="font-heading font-black text-xl">${totalCost.toFixed(5)}</p>
            </div>
          </div>
          <button className="h-14 w-14 bg-foreground text-background flex items-center justify-center hover:invert transition-all">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Workspace Area */}
      <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar flex">
        <div className="flex-1 p-12 max-w-6xl mx-auto w-full">
          
          {/* Objective Block */}
          <section className="mb-20 grid grid-cols-1 lg:grid-cols-12 gap-px bg-foreground/10 border border-foreground/10 shadow-[30px_30px_0px_0px_rgba(0,0,0,0.05)]">
            <div className="lg:col-span-8 p-12 bg-background relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-foreground" />
                <h2 className="mono-label text-foreground tracking-[0.3em]">Architectural Objective</h2>
              </div>
              <p className="text-2xl font-heading font-bold leading-tight text-foreground/90 uppercase tracking-tight">
                "{thread.description || "NO OBJECTIVE DEFINED FOR THIS CONTEXT SECTOR."}"
              </p>
            </div>

            <div className="lg:col-span-4 p-12 bg-background flex flex-col justify-between border-l border-foreground/10">
              <div>
                <h3 className="mono-label text-foreground/40 mb-6">Bridge Command</h3>
                <p className="text-[10px] mono-label text-foreground/60 leading-relaxed mb-10 uppercase tracking-widest">
                  Bridge this context thread to local AI agents via XtraContext MCP.
                </p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => {
                    const config = {
                      mcpServers: {
                        contextvault: {
                          command: "npx",
                          args: ["tsx", "D:/Projects/xtracontext/mcp/server.ts"],
                          env: {
                            XTRACONTEXT_API_URL: `${window.location.origin}/api/v1/mcp/proxy`,
                            XTRACONTEXT_API_KEY: "PASTE_YOUR_ACCESS_TOKEN_HERE"
                          }
                        }
                      }
                    };
                    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
                    alert("Config Committed to Clipboard.");
                  }}
                  className="w-full py-5 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:invert transition-all"
                >
                  Sync MCP Config
                </button>
                <div className="p-4 border border-foreground/5 bg-foreground/[0.02]">
                  <p className="text-[9px] mono-label text-foreground/40 mb-2 italic">Prompt Access</p>
                  <p className="text-[11px] font-mono text-foreground/80 break-all select-all">
                    /memory search {thread.id || thread._id}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Feed */}
          <div className="space-y-px bg-foreground/5">
            <div className="flex items-center gap-4 mb-10">
              <h3 className="text-3xl font-heading font-black uppercase">Log Sequence</h3>
              <div className="flex-1 h-px bg-foreground/10" />
            </div>

            {messages.length === 0 ? (
              <div className="py-24 text-center border border-foreground/10 bg-background">
                <p className="mono-label text-foreground/20 uppercase tracking-[0.4em]">Awaiting Data Input...</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg._id || idx} className="bg-background border border-foreground/10 flex hover:bg-foreground/[0.01] transition-all">
                  {/* Sidebar Metadata */}
                  <div className="w-48 border-r border-foreground/10 p-8 flex flex-col items-center shrink-0">
                    <span className="mono-label text-foreground/20 mb-auto">{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                    <div className={`w-8 h-8 flex items-center justify-center font-black text-xs ${msg.role === 'USER' ? 'bg-foreground text-background' : 'border border-foreground/20 text-foreground'}`}>
                      {msg.role[0]}
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 p-12">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-6">
                        <span className="mono-label text-foreground/40 font-bold tracking-widest">{msg.role}</span>
                        <div className="h-4 w-px bg-foreground/10" />
                        <span className="mono-label text-foreground/20 text-[10px]">{msg.tokenCount || 0} TOKENS COMMIT</span>
                      </div>
                      <button className="text-foreground/20 hover:text-foreground transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap font-medium font-sans">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Action Panel Sidebar */}
        <aside className="w-96 border-l border-foreground/10 p-12 flex flex-col bg-background/50">
          <h4 className="mono-label text-foreground mb-10 tracking-[0.2em]">Context Metadata</h4>
          
          <div className="space-y-10">
            <div className="p-8 noir-card bg-background">
              <p className="mono-label text-foreground/30 mb-2">Agent Affinity</p>
              <div className="h-2 w-full bg-foreground/10 mt-4 overflow-hidden">
                <div className="h-full bg-foreground w-[70%]" />
              </div>
              <p className="text-[10px] mono-label mt-4 text-right">70% NEURAL MATCH</p>
            </div>

            <div className="p-8 noir-card bg-background">
              <p className="mono-label text-foreground/30 mb-2">Stability</p>
              <p className="text-2xl font-heading font-black">CRITICAL</p>
              <p className="text-[10px] mono-label mt-4 text-foreground/40">MEMORY DECAY IN 14 DAYS</p>
            </div>

            <div className="flex-1" />

            <div className="space-y-4">
              <button className="w-full py-5 border-2 border-foreground font-black uppercase tracking-[0.3em] text-xs hover:bg-foreground hover:text-background transition-all">
                Prune Thread
              </button>
              <button className="w-full py-5 bg-foreground text-background font-black uppercase tracking-[0.3em] text-xs hover:invert transition-all">
                Export Sequence
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
