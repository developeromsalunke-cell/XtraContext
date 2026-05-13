"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardSidebar from "@/components/DashboardSidebar";
import { 
  ChevronLeft, 
  Download, 
  Settings as SettingsIcon,
  Info, 
  Tag as TagIcon, 
  MessageSquare,
  User,
  Bot,
  Clock,
  Terminal,
  Copy,
  Zap,
  Check,
  Wand2,
  Shield,
  Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export default function ThreadDetailPage() {
  const { id } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

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

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleExport = () => {
    if (!thread || messages.length === 0) return;
    const exportData = {
      thread,
      messages
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `thread-${thread.id || id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSummarize = async () => {
    if (!thread) return;
    setSummarizing(true);
    try {
      const res = await fetch("/api/v1/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: id, mode: "technical" }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        toast.success("Summary generated successfully");
      } else {
        toast.error("Failed to generate summary");
      }
    } catch (error) {
      console.error("Failed to summarize thread", error);
    } finally {
      setSummarizing(false);
    }
  };

  const handleValidate = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/v1/ai/validate-thread", {
        method: "POST",
        body: JSON.stringify({ threadId: id }),
      });
      const data = await res.json();
      setValidationResult(data);
      if (data.status === 'DEPRECATED') {
        toast.warning("Warning: This thread contains deprecated patterns");
        fetchThread(); // Refresh importance tag
      } else {
        toast.success("Validation completed: State is consistent");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-hidden relative">

          {/* Top Bar */}
          <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#0e0e0e] shrink-0 z-20">
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard" 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <div className="h-4 w-px bg-white/[0.08]" />
              <div className="flex flex-col">
                <h1 className="text-sm font-semibold tracking-tight truncate max-w-[500px]">
                  {loading ? "Loading..." : thread?.title || "Untitled Thread"}
                </h1>
                {!loading && thread && (
                  <div className="flex items-center gap-2 mt-1">
                    {thread.importance && (
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                        thread.importance === 'critical' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                        thread.importance === 'deprecated' ? 'text-gray-500 border-gray-500/30 bg-gray-500/10' :
                        'text-blue-400 border-blue-400/30 bg-blue-400/10'
                      }`}>
                        {thread.importance}
                      </span>
                    )}
                    {Array.isArray(thread.tags) && thread.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] text-gray-400 border border-white/10 px-1.5 py-0.5 rounded bg-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
               <Link 
                 href={`/dashboard/thread/${id}/settings`}
                 className="h-8 px-4 border border-white/10 text-xs font-medium rounded hover:bg-white/[0.06] hover:border-[#FF5733]/50 hover:text-[#FF5733] transition-all text-gray-400 flex items-center gap-2"
               >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  Settings
               </Link>
               <button 
                 onClick={handleExport}
                 disabled={!thread || messages.length === 0}
                 className="h-8 px-4 bg-[#FF5733] text-black text-xs font-bold rounded hover:bg-[#ff6c4d] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
               >
                  <Download className="w-3.5 h-3.5" />
                  Export
               </button>
               <button 
                 onClick={handleValidate}
                 disabled={loading || actionLoading}
                 className="h-8 px-4 border border-white/10 text-xs font-medium rounded hover:bg-white/[0.06] hover:border-[#FF5733]/50 hover:text-[#FF5733] transition-all text-gray-400 flex items-center gap-2 disabled:opacity-50"
               >
                  {actionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Shield className="w-3.5 h-3.5" />
                  )}
                  {actionLoading ? "Validating..." : "Validate"}
               </button>
            </div>
          </header>

          {/* Validation Alert Area */}
          {validationResult && (
            <div className={`px-6 py-3 border-b ${validationResult.status === 'DEPRECATED' ? 'bg-red-950/20 border-red-900/50 text-red-200' : 'bg-green-950/20 border-green-900/50 text-green-200'} text-xs font-medium flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3" />
                <span>{validationResult.message}</span>
              </div>
              <button onClick={() => setValidationResult(null)} className="text-white/40 hover:text-white">Close</button>
            </div>
          )}

          <div className="flex-1 flex overflow-hidden relative z-10">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
              <div className="max-w-3xl mx-auto space-y-8">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="space-y-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#FF5733]/10 border border-[#FF5733]/20 rounded-lg" />
                        <div className="h-3 w-24 bg-[#FF5733]/10 border border-[#FF5733]/20 rounded" />
                      </div>
                      <div className="h-24 w-full bg-[#FF5733]/10 border border-[#FF5733]/20 rounded-xl" />
                    </div>
                  ))
                ) : messages.length === 0 ? (
                  <div className="py-32 text-center border border-dashed border-white/[0.06] rounded-2xl bg-white/[0.01]">
                    <MessageSquare className="w-10 h-10 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm font-medium">No messages yet</p>
                    <p className="text-gray-600 text-xs mt-1">Messages will show up here once captured.</p>
                  </div>
                ) : (
                  messages.map((msg: any, i: number) => {
                    const role = (msg.role || "").toLowerCase();
                    const isUser = role === 'user';
                    return (
                      <div key={i} className="group/msg">
                        {/* Role Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isUser 
                              ? 'bg-white/[0.04] border border-white/[0.06] text-gray-400' 
                              : 'bg-[#FF5733] text-black'
                          }`}>
                            {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="text-sm font-semibold text-gray-200">
                                {isUser ? 'You' : (msg.model || thread?.model || 'AI Assistant')}
                             </span>
                             {msg.platform && (
                               <span className="text-[9px] font-mono font-bold text-gray-500 border border-white/5 px-2 py-0.5 rounded bg-white/[0.03] uppercase tracking-tighter">
                                 {msg.platform}
                               </span>
                             )}
                             <span className="text-xs text-gray-600 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </span>
                          </div>
                          {/* Copy button */}
                          <button 
                            onClick={() => handleCopy(msg.content, i)}
                            className="ml-auto opacity-0 group-hover/msg:opacity-100 transition-opacity h-7 px-2 rounded hover:bg-white/[0.06] text-gray-500 hover:text-white flex items-center gap-1.5"
                            title="Copy message"
                          >
                            {copiedIdx === i ? (
                              <><Check className="w-3 h-3 text-green-400" /><span className="text-[10px] text-green-400">Copied</span></>
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        
                        {/* Message Content */}
                        <div className="pl-11">
                           <div className={`text-sm leading-relaxed p-5 rounded-xl whitespace-pre-wrap ${
                             isUser 
                               ? 'bg-white/[0.02] border border-white/[0.05] text-gray-300' 
                               : 'bg-[#111111] border border-white/[0.06] text-gray-200'
                           }`}>
                             {msg.content}
                           </div>

                           {msg.code && (
                             <div className="mt-3 rounded-xl border border-white/[0.06] bg-[#0c0c0c] overflow-hidden">
                               <div className="px-4 py-2.5 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                     <Terminal className="w-3.5 h-3.5 text-gray-500" />
                                     <span className="text-xs text-gray-500 font-medium">Code</span>
                                  </div>
                                  <button 
                                    onClick={() => handleCopy(msg.code, i + 1000)}
                                    className="p-1.5 rounded hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                                  >
                                     {copiedIdx === i + 1000 ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                  </button>
                               </div>
                               <pre className="p-5 font-mono text-[13px] text-gray-300 overflow-x-auto leading-relaxed custom-scrollbar">
                                 <code className="block">{msg.code}</code>
                               </pre>
                             </div>
                           )}
                        </div>
                      </div>
                    );
                  })
                )}
                {/* End marker */}
                {!loading && messages.length > 0 && (
                  <div className="py-12 flex items-center justify-center gap-3 opacity-20">
                    <div className="h-px w-16 bg-white/30" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">End of thread</span>
                    <div className="h-px w-16 bg-white/30" />
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel */}
            <aside className="w-72 border-l border-white/[0.06] bg-[#0e0e0e] p-6 hidden xl:flex flex-col gap-8 overflow-y-auto custom-scrollbar">
               {/* Thread Info */}
               <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-[#FF5733]" />
                    Details
                  </h3>
                  <div className="space-y-5">
                     <div>
                        <p className="text-xs text-gray-500 mb-1">Model</p>
                        <p className="text-sm font-medium text-white">{thread?.model || "Unknown"}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 mb-1">Total Tokens</p>
                        <p className="text-sm font-medium text-white">{thread?.tokenCount?.toLocaleString() || "—"}</p>
                     </div>
                     <div>
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-sm font-medium text-white">
                          {thread?.createdAt ? new Date(thread.createdAt).toLocaleDateString() : "—"}
                        </p>
                     </div>
                      <div>
                         <p className="text-xs text-gray-500 mb-1">Messages</p>
                         <p className="text-sm font-medium text-white">{messages.length}</p>
                      </div>
                   </div>
                   <div className="mt-5 pt-5 border-t border-white/[0.06]">
                    <button 
                      onClick={handleSummarize}
                      disabled={summarizing || messages.length === 0}
                      className="w-full h-9 bg-white/[0.03] border border-white/[0.06] hover:border-[#FF5733]/50 hover:bg-[#FF5733]/10 hover:text-[#FF5733] transition-all rounded-lg text-xs font-semibold flex items-center justify-center gap-2 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {summarizing ? (
                        <><div className="w-3 h-3 border border-[#FF5733] border-t-transparent rounded-full animate-spin" /> Summarizing...</>
                      ) : (
                        <><Wand2 className="w-3.5 h-3.5" /> Summarize Thread</>
                      )}
                    </button>
                  </div>
               </section>
               
               {/* Summary */}
               {summary && (
                 <section className="bg-[#FF5733]/5 border border-[#FF5733]/20 p-4 rounded-xl">
                   <h3 className="text-xs font-semibold text-[#FF5733] uppercase tracking-wider mb-3 flex items-center gap-2">
                     <Wand2 className="w-3.5 h-3.5" />
                     AI Summary
                   </h3>
                   <div className="prose prose-invert max-w-none text-xs text-gray-300 prose-p:leading-relaxed prose-headings:text-sm prose-headings:mb-2 prose-ul:my-1 prose-li:my-0.5">
                     <ReactMarkdown>{summary}</ReactMarkdown>
                   </div>
                 </section>
               )}

               {/* Tags */}
               {thread?.tags && thread.tags.length > 0 && (
                 <section>
                   <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                     <TagIcon className="w-3.5 h-3.5 text-[#FF5733]" />
                     Tags
                   </h3>
                   <div className="flex flex-wrap gap-2">
                       {thread.tags.map((tag: string) => (
                         <span key={tag} className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs font-medium text-gray-400">
                             {tag}
                         </span>
                       ))}
                   </div>
                 </section>
               )}

               {/* Search Status */}
               <section>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Status</h3>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                        <span className="text-xs text-gray-500">Search Index</span>
                        <span className="text-xs font-medium text-green-400">Ready</span>
                     </div>
                  </div>
               </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
