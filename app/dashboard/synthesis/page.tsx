"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Sparkles, Loader2, FileText, Download, Share2, Zap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function SynthesisPage() {
  const [loading, setLoading] = useState(false);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [focus, setFocus] = useState("");

  const handleSynthesize = async () => {
    setLoading(true);
    const toastId = toast.loading("Synthesizing global memory...");
    try {
      const res = await fetch("/api/v1/ai/synthesize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focus }),
      });
      const data = await res.json();
      setSynthesis(data.synthesis);
      toast.success("Synthesis complete", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate synthesis", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto w-full">
            <header className="mb-12">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                 <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">Tier 3 Intelligence</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-4">Memory Synthesis</h1>
              <p className="text-gray-400 max-w-2xl text-lg leading-relaxed font-medium">
                Aggregate architectural patterns across all projects to extract global organizational learnings.
              </p>
            </header>

            <div className="glass-card p-8 lg:p-10 mb-12 space-y-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles className="w-32 h-32 text-[#FF5733]" />
               </div>

               <div className="space-y-3 relative z-10">
                  <label className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">Synthesis Focus (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Performance constraints, security patterns, tech debt..."
                    value={focus}
                    onChange={(e) => setFocus(e.target.value)}
                    className="input-noir w-full h-14 px-6 text-lg"
                  />
               </div>

               <button 
                 onClick={handleSynthesize}
                 disabled={loading}
                 className="btn-premium w-full h-14 text-lg shadow-[0_0_30px_rgba(255,87,51,0.15)]"
               >
                 {loading ? (
                   <>
                     <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                     Synthesizing Global Memory...
                   </>
                 ) : (
                   <>
                     <Sparkles className="w-5 h-5 mr-3" />
                     Generate Synthesis
                   </>
                 )}
               </button>
            </div>

            {synthesis && (
              <div className="animate-in fade-in slide-in-from-bottom duration-700 space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-[#FF5733]/10 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-[#FF5733]" />
                       </div>
                       <h2 className="text-xl font-bold tracking-tight">Executive Report</h2>
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">
                          <Download className="w-4 h-4" />
                       </button>
                       <button className="p-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-all">
                          <Share2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>

                 <div className="prose prose-invert prose-orange max-w-none glass-card p-10 leading-relaxed border-[#FF5733]/10">
                   <ReactMarkdown>{synthesis}</ReactMarkdown>
                 </div>

                 <div className="p-6 rounded-2xl bg-[#FF5733]/5 border border-[#FF5733]/20 flex items-start gap-4">
                    <Zap className="w-5 h-5 text-[#FF5733] shrink-0 mt-1" />
                    <div>
                       <p className="text-sm font-bold text-white mb-1">AI Recommendation</p>
                       <p className="text-sm text-gray-400 leading-relaxed">
                         This synthesis was generated by analyzing the last 50 architectural decisions. Review the "deprecated" patterns to avoid repeating technical debt.
                       </p>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
