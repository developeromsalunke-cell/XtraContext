"use client";

import { useState, useEffect } from "react";
import { History, GitMerge, FileText, ChevronRight, Clock, Box, Database, Zap, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import DashboardSidebar from "@/components/DashboardSidebar";
import { toast } from "sonner";

export default function TimelinePage() {
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [selectedA, setSelectedA] = useState<any>(null);
  const [selectedB, setSelectedB] = useState<any>(null);
  const [diffSummary, setDiffSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [diffing, setDiffing] = useState(false);

  useEffect(() => {
    async function fetchSnapshots() {
      try {
        const res = await fetch("/api/v1/context-states");
        if (res.ok) {
          const data = await res.json();
          setSnapshots(data.snapshots || []);
        }
      } catch (err) {
        console.error("Failed to fetch snapshots", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSnapshots();
  }, []);

  const handleDiff = async () => {
    if (!selectedA || !selectedB) return;
    setDiffSummary("");
    setDiffing(true);
    const toastId = toast.loading("Analyzing temporal deltas...");
    try {
      const res = await fetch("/api/v1/ai/diff-snapshots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contentA: selectedA.content, 
          contentB: selectedB.content,
          metadataA: { version: selectedA.version, createdAt: selectedA.createdAt },
          metadataB: { version: selectedB.version, createdAt: selectedB.createdAt }
        })
      });
      const data = await res.json();
      if (data.summary) {
        setDiffSummary(data.summary);
        toast.success("Analysis complete", { id: toastId });
      } else {
        toast.error("Failed to generate analysis", { id: toastId });
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred during analysis", { id: toastId });
    } finally {
      setDiffing(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <DashboardSidebar />

      <main className="flex-1 flex flex-col min-w-0 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FF5733]/5 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        </div>

        {/* Header Overlay */}
        <header className="relative z-20 shrink-0 p-8 border-b border-white/[0.05] bg-[#0A0A0A]/50 backdrop-blur-xl flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl relative group">
              <div className="absolute inset-0 bg-[#FF5733]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <History className="w-6 h-6 text-[#FF5733] relative z-10" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] font-mono font-bold text-[#FF5733] uppercase tracking-[0.3em]">Temporal Audit</span>
                 <div className="h-px w-8 bg-white/10" />
                 <span className="text-[10px] font-mono text-gray-500 uppercase">Version Control</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gradient">Time-Travel Debugging</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-right">
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Status</span>
                <div className="flex items-center gap-2 justify-end">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                   <span className="text-xs font-medium text-gray-300">System Synced</span>
                </div>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Snapshots</span>
                <span className="text-xl font-bold text-white">{snapshots.length}</span>
             </div>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden relative z-10">
          
          {/* Timeline Sidebar */}
          <div className="w-96 border-r border-white/[0.05] bg-black/20 flex flex-col">
            <div className="p-6 pb-2">
               <h2 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                 <Clock className="w-3.5 h-3.5" />
                 Temporal History
               </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-8 custom-scrollbar">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-24 bg-white/[0.03] border border-white/5 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : snapshots.length === 0 ? (
                <div className="p-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
                  <Box className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 font-medium italic">Void state detected.</p>
                  <p className="text-[10px] text-gray-600 mt-2 uppercase tracking-widest leading-relaxed">No memory clusters found.<br/>Sync context to begin.</p>
                </div>
              ) : (
                snapshots.map((snap) => {
                  const isA = selectedA?._id === snap._id;
                  const isB = selectedB?._id === snap._id;
                  
                  return (
                    <div 
                      key={snap._id} 
                      className={`group relative p-5 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                        isA ? 'border-[#FF5733] bg-[#FF5733]/10 shadow-[0_0_30px_rgba(255,87,51,0.1)]' : 
                        isB ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 
                        'border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                      }`}
                      onClick={() => {
                        if (!selectedA || (selectedA && selectedB)) {
                          setSelectedA(snap);
                          setSelectedB(null);
                        } else {
                          if (new Date(snap.createdAt) < new Date(selectedA.createdAt)) {
                             setSelectedB(selectedA);
                             setSelectedA(snap);
                          } else {
                             setSelectedB(snap);
                          }
                        }
                      }}
                    >
                      {/* Selection Badge */}
                      {(isA || isB) && (
                        <div className={`absolute top-0 right-0 px-3 py-1 text-[8px] font-black uppercase tracking-widest ${isA ? 'bg-[#FF5733] text-black' : 'bg-blue-500 text-black'}`}>
                          {isA ? 'Source A' : 'Target B'}
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-3">
                         <div className="flex items-center gap-2">
                            <span className={`text-lg font-black font-mono ${isA ? 'text-[#FF5733]' : isB ? 'text-blue-500' : 'text-white'}`}>
                              V{snap.version}
                            </span>
                         </div>
                         <div className="text-[10px] text-gray-500 font-mono">
                            {new Date(snap.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                           <div className="flex items-center gap-1.5">
                              <Database className="w-3 h-3" />
                              {Math.round(snap.content.length / 1024)} KB
                           </div>
                           <div className="h-1 w-1 rounded-full bg-white/20" />
                           <div className="flex items-center gap-1.5">
                              <Activity className="w-3 h-3" />
                              {snap.checksum.substring(0, 8)}
                           </div>
                        </div>
                        
                        <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed italic">
                           {snap.content.substring(0, 100)}...
                        </p>
                      </div>

                      <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                            {new Date(snap.createdAt).toLocaleDateString()}
                         </div>
                         <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                            <ChevronRight className="w-3 h-3 text-gray-500" />
                         </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-[#0A0A0A]/30 flex flex-col relative overflow-hidden">
             {selectedA && selectedB ? (
                <div className="flex-1 flex flex-col p-8 overflow-hidden">
                   {/* Comparison Header */}
                   <div className="grid grid-cols-[1fr,auto,1fr,auto] gap-6 items-center mb-8 bg-white/[0.03] p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                      <div className="space-y-1">
                         <div className="text-[10px] font-bold text-[#FF5733] uppercase tracking-widest">Snapshot A (Source)</div>
                         <div className="text-2xl font-black text-white">Version {selectedA.version}</div>
                         <div className="text-xs text-gray-500 font-mono italic">{new Date(selectedA.createdAt).toLocaleString()}</div>
                      </div>
                      
                      <div className="w-12 h-12 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-600">
                         <ArrowRight className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                         <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Snapshot B (Target)</div>
                         <div className="text-2xl font-black text-white">Version {selectedB.version}</div>
                         <div className="text-xs text-gray-500 font-mono italic">{new Date(selectedB.createdAt).toLocaleString()}</div>
                      </div>

                      <div className="pl-6 border-l border-white/10">
                         <button 
                           onClick={handleDiff}
                           disabled={diffing}
                           className="h-14 px-8 bg-[#FF5733] hover:bg-[#ff6b4a] text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 flex items-center gap-3 shadow-[0_0_30px_rgba(255,87,51,0.2)] hover:shadow-[0_0_40px_rgba(255,87,51,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                         >
                            {diffing ? (
                               <Zap className="w-4 h-4 animate-bounce" />
                            ) : (
                               <GitMerge className="w-4 h-4" />
                            )}
                            Initialize Comparison
                         </button>
                      </div>
                   </div>

                   {/* Output Area */}
                   <div className="flex-1 overflow-hidden flex flex-col bg-white/[0.02] border border-white/10 rounded-3xl">
                      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                         <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_5px_rgba(255,87,51,0.5)]" />
                            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Architectural Delta Analysis</span>
                         </div>
                         <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                            <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                         </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                         {diffing ? (
                            <div className="h-full flex flex-col items-center justify-center space-y-6">
                               <div className="relative">
                                  <div className="w-20 h-20 border border-white/5 rounded-full" />
                                  <div className="absolute inset-0 w-20 h-20 border-t-2 border-[#FF5733] rounded-full animate-spin" />
                               </div>
                               <div className="text-center space-y-2">
                                  <p className="text-sm font-bold text-white uppercase tracking-[0.3em] animate-pulse">Analyzing Discrepancies</p>
                                  <p className="text-[10px] text-gray-500 font-mono">Running Groq synthesis on context deltas...</p>
                               </div>
                            </div>
                         ) : diffSummary ? (
                            <div className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-headings:font-black prose-p:text-gray-400 prose-strong:text-[#FF5733] prose-code:bg-white/5 prose-code:px-1 prose-code:rounded">
                               <ReactMarkdown>{diffSummary}</ReactMarkdown>
                            </div>
                         ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-700 opacity-40 grayscale">
                               <GitMerge className="w-20 h-20 mb-6 stroke-[1px]" />
                               <p className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Awaiting Execution</p>
                            </div>
                         )}
                      </div>
                   </div>
                </div>
             ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                   <div className="relative mb-8 group">
                      <div className="absolute inset-0 bg-[#FF5733]/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-32 h-32 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center backdrop-blur-xl shadow-2xl">
                         <History className="w-12 h-12 text-[#FF5733]/30 group-hover:text-[#FF5733] transition-colors" />
                         <div className="absolute inset-0 border-t-2 border-[#FF5733]/20 rounded-full animate-[spin_10s_linear_infinite]" />
                      </div>
                   </div>
                   <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Select Temporal Anchors</h3>
                   <p className="text-center max-w-md text-gray-500 text-sm leading-relaxed px-8">
                     Comparison requires two distinct snapshots. Choose the source and target versions from the timeline to generate an AI-driven architectural delta report.
                   </p>
                   <div className="mt-10 flex gap-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600">
                         <ShieldCheck className="w-3 h-3 text-gray-700" />
                         Integrity Validated
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-600">
                         <Zap className="w-3 h-3 text-gray-700" />
                         Low Latency Diffing
                      </div>
                   </div>
                </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
}
