"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Network, Search, Filter, Maximize2, ZoomIn, ZoomOut, ChevronRight, X, Info, Layers } from "lucide-react";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import DashboardSidebar from "@/components/DashboardSidebar";

export default function GraphPage() {
  const [data, setData] = useState<{ nodes: any[]; links: any[] }>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(["team", "thread", "model"]);
  
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/graph");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch graph data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const filteredNodes = data.nodes.filter(node => 
      activeFilters.includes(node.type) && 
      (searchQuery === "" || node.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = data.links.filter(link => 
      nodeIds.has(typeof link.source === 'object' ? link.source.id : link.source) && 
      nodeIds.has(typeof link.target === 'object' ? link.target.id : link.target)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [data, searchQuery, activeFilters]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleZoomIn = () => graphRef.current?.zoomIn();
  const handleZoomOut = () => graphRef.current?.zoomOut();
  const handleMaximize = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <DashboardSidebar />

      <main ref={containerRef} className="flex-1 flex flex-col min-w-0 relative overflow-hidden bg-[#0A0A0A]">
        {/* Subtle Kinetic Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        {/* UI Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col">
          
          {/* Header Overlay */}
          <div className="w-full p-8 flex items-start justify-between">
            <div className="pointer-events-auto flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
                <Network className="w-6 h-6 text-[#FF5733]" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                   <div className="w-2 h-2 rounded-full bg-[#FF5733] animate-pulse" />
                   <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Neural Topology</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gradient">Knowledge Graph</h1>
              </div>
            </div>

            <div className="pointer-events-auto flex flex-col items-end gap-4">
               {/* Search Bar */}
               <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF5733] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search nodes..." 
                    className="h-11 w-64 pl-12 pr-4 bg-white/[0.03] border border-white/10 rounded-full text-xs font-medium placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF5733]/50 focus:bg-white/[0.05] transition-all backdrop-blur-md text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>

               {/* Legend / Filters */}
               <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] border border-white/10 rounded-full backdrop-blur-md">
                 <button 
                   onClick={() => toggleFilter("team")}
                   className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilters.includes("team") ? "bg-white text-black" : "text-gray-500 hover:text-white"}`}
                 >
                   <div className={`w-1.5 h-1.5 rounded-full ${activeFilters.includes("team") ? "bg-black" : "bg-white"}`} />
                   Teams
                 </button>
                 <button 
                   onClick={() => toggleFilter("thread")}
                   className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilters.includes("thread") ? "bg-[#FF5733] text-black" : "text-gray-500 hover:text-white"}`}
                 >
                   <div className={`w-1.5 h-1.5 rounded-full ${activeFilters.includes("thread") ? "bg-black" : "bg-[#FF5733]"}`} />
                   Threads
                 </button>
                 <button 
                   onClick={() => toggleFilter("model")}
                   className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilters.includes("model") ? "bg-[#8888ff] text-black" : "text-gray-500 hover:text-white"}`}
                 >
                   <div className={`w-1.5 h-1.5 rounded-full ${activeFilters.includes("model") ? "bg-black" : "bg-[#8888ff]"}`} />
                   Models
                 </button>
               </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Bottom Toolbar Overlay */}
          <div className="p-8 flex items-end justify-between">
             <div className="pointer-events-auto flex items-center gap-2">
                <div className="px-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl backdrop-blur-md flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Nodes</span>
                      <span className="text-sm font-bold">{filteredData.nodes.length}</span>
                   </div>
                   <div className="w-px h-6 bg-white/10" />
                   <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-mono uppercase tracking-tighter">Links</span>
                      <span className="text-sm font-bold">{filteredData.links.length}</span>
                   </div>
                </div>
             </div>

             <div className="pointer-events-auto flex items-center gap-3">
                <button 
                  onClick={handleZoomIn}
                  className="w-11 h-11 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#FF5733]/10 hover:border-[#FF5733]/30 text-gray-400 hover:text-[#FF5733] transition-all backdrop-blur-md"
                >
                   <ZoomIn className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleZoomOut}
                  className="w-11 h-11 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#FF5733]/10 hover:border-[#FF5733]/30 text-gray-400 hover:text-[#FF5733] transition-all backdrop-blur-md"
                >
                   <ZoomOut className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleMaximize}
                  className="w-11 h-11 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#FF5733]/10 hover:border-[#FF5733]/30 text-gray-400 hover:text-[#FF5733] transition-all backdrop-blur-md"
                >
                   <Maximize2 className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Selected Node Panel (Slide-in) */}
        {selectedNode && (
          <div className="absolute top-1/2 -translate-y-1/2 right-8 z-40 w-80 glass-card p-0 animate-in slide-in-from-right duration-500 pointer-events-auto overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="p-6 border-b border-white/10 bg-[#FF5733]/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-8 h-8 rounded bg-black/40 border border-white/10 flex items-center justify-center`}>
                      <Info className="w-4 h-4 text-[#FF5733]" />
                   </div>
                   <h3 className="text-sm font-bold uppercase tracking-widest text-white">Node Details</h3>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-gray-500 hover:text-white transition-colors">
                   <X className="w-4 h-4" />
                </button>
             </div>
             <div className="p-8 space-y-8">
                <div className="space-y-2">
                   <p className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Identification</p>
                   <h4 className="text-xl font-bold text-white leading-tight">{selectedNode.label}</h4>
                   <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      selectedNode.type === 'team' ? 'border-white/20 text-white bg-white/5' : 
                      selectedNode.type === 'thread' ? 'border-[#FF5733]/30 text-[#FF5733] bg-[#FF5733]/5' : 
                      'border-blue-400/30 text-blue-400 bg-blue-400/5'
                   }`}>
                      {selectedNode.type}
                   </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-mono text-gray-500 uppercase">Mass</p>
                      <p className="text-sm font-bold">{selectedNode.val}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-mono text-gray-500 uppercase">System</p>
                      <p className="text-sm font-bold">Stable</p>
                   </div>
                </div>

                <button 
                  onClick={() => selectedNode.type === 'thread' && (window.location.href = `/dashboard/thread/${selectedNode.id}`)}
                  className="w-full h-11 rounded bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#FF5733] hover:text-black transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Inspect Context
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
             <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF5733] to-transparent opacity-30" />
          </div>
        )}

        {/* Graph Canvas Area */}
        <div className="flex-1 w-full h-full relative z-10">
          {loading ? (
             <div className="w-full h-full flex items-center justify-center bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-6">
                   <div className="relative">
                      <div className="w-16 h-16 border border-white/5 rounded-full" />
                      <div className="absolute inset-0 w-16 h-16 border-t-2 border-[#FF5733] rounded-full animate-spin" />
                   </div>
                   <p className="text-gray-500 text-xs font-mono tracking-[0.4em] uppercase animate-pulse">Syncing neural clusters...</p>
                </div>
             </div>
          ) : (
             <KnowledgeGraph 
               ref={graphRef}
               data={filteredData} 
               onNodeSelect={(node: any) => setSelectedNode(node)}
             />
          )}
        </div>
      </main>
    </div>
  );
}
