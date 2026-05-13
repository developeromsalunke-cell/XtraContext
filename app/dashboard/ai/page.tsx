"use client";

import React, { useState, useRef, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Bot, Send, BrainCircuit, Hash } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<{role: 'user' | 'assistant', content: string, sources?: any[]}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = question;
    setQuestion("");
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/v1/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });
      
      const data = await res.json();
      
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer || "I'm sorry, I couldn't process that request.",
        sources: data.sources || []
      }]);
    } catch (error) {
      console.error("Failed to query AI", error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: "There was an error communicating with the AI. Please try again later."
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] relative">
          <header className="px-8 lg:px-12 py-8 shrink-0 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Groq AI Engine</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <Bot className="w-8 h-8 text-[#FF5733]" />
              XtraContext Assistant
            </h1>
          </header>

          <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-8 pb-20">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-20 opacity-50">
                  <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-6">
                    <BrainCircuit className="w-8 h-8 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-300 mb-2">Ask your memory vault anything</h2>
                  <p className="text-sm text-gray-500 max-w-md">
                    I can search across your architectural decisions, code patterns, and project discussions to synthesize an answer.
                  </p>
                </div>
              ) : (
                conversation.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-[#FF5733]/10 border border-[#FF5733]/30 flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4 text-[#FF5733]" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl p-5 ${msg.role === 'user' ? 'bg-[#FF5733] text-black rounded-tr-sm' : 'bg-white/[0.03] border border-white/[0.06] rounded-tl-sm'}`}>
                      <div className="prose prose-invert max-w-none text-sm font-medium leading-relaxed prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/[0.08]">
                        {msg.role === 'assistant' ? (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>
                      
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/[0.06]">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Sources used</p>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map(source => (
                              <Link 
                                key={source._id} 
                                href={`/dashboard/thread/${source._id}`}
                                className="flex items-center gap-2 bg-black/40 border border-white/[0.08] hover:border-[#FF5733]/40 rounded-lg px-3 py-2 transition-colors group"
                              >
                                <Hash className="w-3 h-3 text-gray-500 group-hover:text-[#FF5733]" />
                                <span className="text-xs font-medium text-gray-300 group-hover:text-white truncate max-w-[200px]">{source.title}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#FF5733]/10 border border-[#FF5733]/30 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[#FF5733]" />
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl rounded-tl-sm p-5 flex items-center gap-2 h-[60px]">
                    <div className="w-2 h-2 bg-[#FF5733] rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-[#FF5733] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-[#FF5733] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-8 lg:px-12 pb-8 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent shrink-0">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">
              <input 
                type="text" 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about your architecture, decisions, or code patterns..."
                className="w-full bg-[#050505] border border-white/[0.08] text-white pl-6 pr-14 py-4 rounded-2xl font-medium text-sm focus:outline-none focus:border-[#444444] focus:bg-[#0a0a0a] focus:ring-4 focus:ring-white/[0.02] transition-all"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!question.trim() || loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-[#FF5733]/10 text-[#FF5733] hover:bg-[#FF5733] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
