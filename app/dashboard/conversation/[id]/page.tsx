"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ConversationDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`/api/v1/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setConversation(data.conversation);
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Failed to fetch conversation details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-background text-center">
        <h2 className="text-2xl font-bold mb-2">Memory Not Found</h2>
        <p className="text-foreground/60 mb-6">This conversation may have been deleted or you don't have access.</p>
        <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate totals
  const totalTokens = messages.reduce((sum, m) => sum + (m.tokenCount || 0), 0);
  const totalCost = messages.reduce((sum, m) => sum + (m.cost || 0), 0);

  return (
    <div className="flex flex-col h-screen bg-background font-sans">
      {/* Header */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-xl z-10 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="w-10 h-10 rounded-full glass border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all text-foreground/60 hover:text-foreground">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{conversation.title}</h1>
            <div className="flex items-center gap-3 text-xs text-foreground/40 mt-1 font-mono">
              <span className="uppercase tracking-widest text-brand-primary">{conversation.platform}</span>
              <span>•</span>
              <span>{conversation.model}</span>
              <span>•</span>
              <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl glass border border-white/5 text-xs text-right">
            <p className="font-bold text-foreground">{totalTokens.toLocaleString()} <span className="text-foreground/40 font-normal">Tokens</span></p>
            <p className="text-brand-secondary/80 font-mono">${totalCost.toFixed(4)}</p>
          </div>
          <Link href={`/dashboard/conversation/${id}/settings`} className="w-10 h-10 rounded-xl glass border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all text-foreground/60 hover:text-foreground">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Message Thread */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto space-y-8 relative z-10 pb-20">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-foreground/40 font-medium">No messages captured yet.</p>
              <p className="text-xs text-foreground/20 mt-2">Memory initialized and waiting for context via MCP.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-6 ${
                  msg.role === "USER" 
                    ? "bg-brand-primary/10 border border-brand-primary/20 rounded-tr-sm" 
                    : "glass border border-white/5 rounded-tl-sm"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/40">
                      {msg.role}
                    </span>
                    {(msg.tokenCount > 0) && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-foreground/40">
                        {msg.tokenCount} tkns
                      </span>
                    )}
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
