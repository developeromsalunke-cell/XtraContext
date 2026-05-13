"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  MessageSquare, 
  Search, 
  Clock, 
  Zap, 
  ArrowRight,
  Filter
} from "lucide-react";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("ALL");
  const [modelFilter, setModelFilter] = useState("ALL");

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/v1/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data.conversations || []);
        }
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const platforms = Array.from(new Set(conversations.map(c => c.platform).filter(Boolean)));
  const models = Array.from(new Set(conversations.map(c => c.model).filter(Boolean)));

  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === "ALL" || c.platform === platformFilter;
    const matchesModel = modelFilter === "ALL" || c.model === modelFilter;
    
    return matchesSearch && matchesPlatform && matchesModel;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar relative">
          <div className="max-w-5xl mx-auto w-full relative z-10">
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-3">
                 <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                 <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Thread Matrix</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-8">All Context Threads</h1>
              
              <div className="flex items-center gap-4">
                 <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                       <Search className="w-4 h-4 text-gray-500" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search architecture vaults..." 
                      className="w-full h-12 bg-white/[0.02] border border-white/[0.05] rounded-xl pl-12 pr-4 text-sm font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#FF5733]/50 transition-colors"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
                 <select 
                   value={platformFilter}
                   onChange={(e) => setPlatformFilter(e.target.value)}
                   className="h-12 px-4 bg-[#111] border border-white/[0.05] rounded-xl text-sm font-medium text-gray-300 focus:outline-none focus:border-[#FF5733]/50 transition-colors cursor-pointer"
                 >
                   <option value="ALL">All Platforms</option>
                   {platforms.map(p => (
                     <option key={p as string} value={p as string}>{p as string}</option>
                   ))}
                 </select>
                 
                 <select 
                   value={modelFilter}
                   onChange={(e) => setModelFilter(e.target.value)}
                   className="h-12 px-4 bg-[#111] border border-white/[0.05] rounded-xl text-sm font-medium text-gray-300 focus:outline-none focus:border-[#FF5733]/50 transition-colors cursor-pointer"
                 >
                   <option value="ALL">All Models</option>
                   {models.map(m => (
                     <option key={m as string} value={m as string}>{m as string}</option>
                   ))}
                 </select>
              </div>
            </header>

            <div className="space-y-4">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-[#FF5733]/10 border border-[#FF5733]/20 rounded-2xl animate-pulse" />
                ))
              ) : filteredConversations.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-white/[0.05] rounded-3xl bg-white/[0.01]">
                   <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-4 opacity-50" />
                   <p className="text-sm text-gray-500 font-medium">No threads found.</p>
                   {searchQuery && (
                     <p className="text-xs text-gray-600 mt-1">Try adjusting your search parameters.</p>
                   )}
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <Link 
                    key={conv._id} 
                    href={`/dashboard/thread/${conv._id}`}
                    className="group block card-noir relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5733]/0 via-white/0 to-[#FF5733]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                       <div className="flex items-start sm:items-center gap-4">
                          <div className="w-12 h-12 shrink-0 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:border-[#FF5733]/30 group-hover:bg-[#FF5733]/5 transition-all">
                             <MessageSquare className="w-5 h-5 text-gray-400 group-hover:text-[#FF5733] transition-colors" />
                          </div>
                          <div>
                             <h3 className="text-base font-semibold text-gray-200 group-hover:text-[#FF5733] mb-1.5 transition-colors">
                               {conv.title}
                             </h3>
                             <p className="text-[13px] text-gray-500 font-medium line-clamp-1 mb-2">
                               {conv.description || "No description provided."}
                             </p>
                             <div className="flex items-center flex-wrap gap-3 text-[11px] text-gray-500 font-medium">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-gray-600" /> 
                                  {new Date(conv.updatedAt).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Zap className="w-3.5 h-3.5 text-[#FF5733]/70" /> 
                                  {conv.messageCount || 0} logs captured
                                </span>
                                {conv.platform && (
                                  <span className="px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded-md text-gray-400">
                                    {conv.platform}
                                  </span>
                                )}
                                {conv.model && (
                                  <span className="px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded-md text-gray-400">
                                    {conv.model}
                                  </span>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-white/[0.02] group-hover:bg-[#FF5733]/10 transition-all sm:self-center ml-16 sm:ml-0">
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-[#FF5733]" />
                       </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
