"use client";

import React, { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { BookText, Blocks, KeyRound, ShieldCheck, Bot, CheckCircle2, Copy, Search, MessageSquare, CheckSquare } from "lucide-react";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const sections = [
    { id: "introduction", title: "Introduction", icon: BookText },
    { id: "authentication", title: "Authentication", icon: KeyRound },
    { id: "mcp-setup", title: "MCP Integration", icon: Blocks },
    { id: "capabilities", title: "AI Capabilities", icon: Bot },
    { id: "auto-docs", title: "Auto-Documentation", icon: BookText },
  ];

  const [docFormat, setDocFormat] = useState("adr");
  const [selectedThreadIds, setSelectedThreadIds] = useState<string[]>([]);
  const [availableThreads, setAvailableThreads] = useState<any[]>([]);
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  React.useEffect(() => {
    if (activeSection === "auto-docs" && availableThreads.length === 0) {
      fetch("/api/v1/conversations").then(res => res.json()).then(data => {
        setAvailableThreads(data.conversations || []);
      });
    }
  }, [activeSection, availableThreads.length]);

  const handleGenerateDoc = async () => {
    if (selectedThreadIds.length === 0) return;
    setGeneratingDoc(true);
    try {
      const res = await fetch("/api/v1/ai/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadIds: selectedThreadIds, format: docFormat }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedDoc(data.markdown);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingDoc(false);
    }
  };

  const toggleThread = (id: string) => {
    setSelectedThreadIds(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const CodeBlock = ({ code, language = "json" }: { code: string, language?: string }) => (
    <div className="relative group rounded-xl overflow-hidden border border-white/[0.1] bg-[#0A0A0A] my-6">
      <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.05]">
        <span className="text-xs font-mono text-gray-500">{language}</span>
        <button 
          onClick={() => copyToClipboard(code)}
          className="text-gray-500 hover:text-white transition-colors"
          title="Copy code"
        >
          {copiedText === code ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm font-mono text-gray-300 custom-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex min-w-0 bg-[#0A0A0A] overflow-hidden relative">
          
          {/* Docs TOC Sidebar */}
          <div className="w-[280px] shrink-0 border-r border-white/[0.05] bg-white/[0.01] h-full overflow-y-auto hidden md:block">
            <div className="p-8">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Documentation</h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeSection === section.id
                          ? "bg-[#FF5733]/10 text-[#FF5733] border border-[#FF5733]/20"
                          : "text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.title}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar relative">
            <div className="max-w-3xl mx-auto pb-32">
              
              {/* INTRODUCTION */}
              {activeSection === "introduction" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                      <BookText className="w-5 h-5 text-[#FF5733]" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Introduction</h1>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Welcome to <span className="text-white font-semibold">XtraContext</span>, the AI Architectural Memory Vault. XtraContext bridges the gap between your development tools and long-term project memory using the Model Context Protocol (MCP).
                  </p>
                  
                  <div className="card-noir p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] mt-8">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#FF5733]" />
                      Core Philosophy
                    </h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3 text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                        <span><strong className="text-gray-200">Never lose context:</strong> Every architectural decision, schema change, and complex bug fix is safely logged and indexed.</span>
                      </li>
                      <li className="flex gap-3 text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                        <span><strong className="text-gray-200">AI-Native:</strong> Built from the ground up for AI agents to query, read, and write using the secure MCP standard.</span>
                      </li>
                      <li className="flex gap-3 text-gray-400">
                        <CheckCircle2 className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                        <span><strong className="text-gray-200">Enterprise Grade:</strong> Tracks token usage, model choices, and operational costs seamlessly.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* AUTHENTICATION */}
              {activeSection === "authentication" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-[#FF5733]" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Authentication</h1>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    To connect an external AI agent to XtraContext, you must generate a secure API Key. Keys are scoped strictly to your authenticated workspace.
                  </p>

                  <div className="space-y-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-200 border-b border-white/[0.05] pb-2">1. Generate an API Key</h3>
                    <p className="text-gray-400">Navigate to the <strong>API Keys</strong> tab in the sidebar. Click the "Generate New Key" button and copy the resulting string.</p>
                    
                    <div className="p-4 rounded-xl bg-[#FF5733]/5 border border-[#FF5733]/20 flex gap-4">
                      <ShieldCheck className="w-6 h-6 text-[#FF5733] shrink-0" />
                      <div>
                        <h4 className="text-[#FF5733] font-semibold mb-1">Security Warning</h4>
                        <p className="text-sm text-[#FF5733]/80">Your API key is only shown once. If you lose it, you must revoke it and generate a new one. Never commit your API key to public repositories.</p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-200 border-b border-white/[0.05] pb-2 mt-8">2. Environment Configuration</h3>
                    <p className="text-gray-400">When running the MCP server, you must provide your API Key and the API URL as environment variables:</p>
                    <CodeBlock 
                      language="bash" 
                      code={`export XTRACONTEXT_API_KEY="xc_..."\nexport XTRACONTEXT_API_URL="http://localhost:3000/api/v1/mcp/proxy"`} 
                    />
                  </div>
                </div>
              )}

              {/* MCP SETUP */}
              {activeSection === "mcp-setup" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                      <Blocks className="w-5 h-5 text-[#FF5733]" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">MCP Integration</h1>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    XtraContext operates as a standard Model Context Protocol (MCP) server over standard input/output (stdio). Follow the instructions below to connect your favorite AI IDEs or Desktop agents.
                  </p>

                  <div className="space-y-6 mt-8">
                    <h3 className="text-xl font-semibold text-gray-200 border-b border-white/[0.05] pb-2">Universal MCP Configuration</h3>
                    <p className="text-gray-400">The connection process is fundamentally the same across <strong>any MCP-compatible AI client</strong> (Claude Desktop, Cursor, Windsurf, etc.). You simply provide the exact path to the compiled server file along with your environment variables.</p>
                    
                    <h4 className="text-lg font-semibold text-gray-300 mt-6">Example: Claude Desktop</h4>
                    <p className="text-gray-400 text-sm mb-2">On Mac, edit <code className="text-[#FF5733] bg-[#FF5733]/10 px-2 py-0.5 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code>:</p>
                    
                    <CodeBlock 
                      language="json" 
                      code={`{
  "mcpServers": {
    "xtracontext": {
      "command": "node",
      "args": ["/absolute/path/to/xtracontext/dist/mcp/server.js"],
      "env": {
        "XTRACONTEXT_API_KEY": "xc_...",
        "XTRACONTEXT_API_URL": "http://localhost:3000/api/v1/mcp/proxy"
      }
    }
  }
}`} 
                    />

                    <h4 className="text-lg font-semibold text-gray-300 mt-8">Example: Cursor IDE</h4>
                    <p className="text-gray-400 text-sm mb-2">Go to <strong>Settings &gt; Features &gt; MCP</strong> and click "+ Add New MCP Server":</p>
                    <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 ml-2">
                      <li><strong>Type:</strong> <code className="text-white">command</code></li>
                      <li><strong>Name:</strong> <code className="text-white">xtracontext</code></li>
                      <li><strong>Command:</strong> <code className="text-[#FF5733] bg-[#FF5733]/10 px-2 py-0.5 rounded">node /absolute/path/to/xtracontext/dist/mcp/server.js</code></li>
                    </ul>
                    <p className="text-gray-400 text-sm mt-4 italic">Don't forget to inject the two Environment Variables (XTRACONTEXT_API_KEY and XTRACONTEXT_API_URL) via your terminal or IDE settings before running.</p>
                  </div>
                </div>
              )}

              {/* CAPABILITIES */}
              {activeSection === "capabilities" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-[#FF5733]" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">AI Capabilities</h1>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Once connected, your AI agents have access to a suite of highly-specific architectural tools.
                  </p>

                  <div className="grid gap-6 mt-8">
                    <div className="card-noir p-6 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                        <Search className="w-5 h-5 text-[#FF5733]" /> search_memory
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">Searches the entire memory vault for specific architectural decisions. Supports semantic matching and exact UUID lookups.</p>
                      <div className="text-xs font-mono text-[#FF5733] bg-[#FF5733]/5 p-3 rounded-lg border border-[#FF5733]/10">
                        <strong>Filters:</strong> The AI can apply strict filters using <code className="text-white">platform</code> and <code className="text-white">model</code> (e.g. searching only ChatGPT outputs).
                      </div>
                    </div>

                    <div className="card-noir p-6 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                        <MessageSquare className="w-5 h-5 text-[#FF5733]" /> log_action & append_memory
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">Logs decisions as independent threads. If an AI requires follow-up, it can append directly to existing threads.</p>
                      <div className="text-xs font-mono text-[#FF5733] bg-[#FF5733]/5 p-3 rounded-lg border border-[#FF5733]/10">
                        <strong>Metrics:</strong> These tools securely log <code className="text-white">totalTokens</code> and <code className="text-white">totalCost</code> directly into your dashboard telemetry.
                      </div>
                    </div>

                    <div className="card-noir p-6 rounded-2xl border border-white/[0.05] bg-white/[0.01]">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
                        <CheckSquare className="w-5 h-5 text-[#FF5733]" /> Task Management
                      </h3>
                      <p className="text-sm text-gray-400">The AI can create and complete explicit <strong>TODO</strong> tasks using <code className="text-white">add_todo</code>, <code className="text-white">list_todos</code>, and <code className="text-white">complete_todo</code>.</p>
                    </div>
                  </div>
                </div>
              )}
              {/* AUTO-DOCS */}
              {activeSection === "auto-docs" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-10 h-10 rounded-xl bg-[#FF5733]/10 border border-[#FF5733]/20 flex items-center justify-center">
                        <BookText className="w-5 h-5 text-[#FF5733]" />
                     </div>
                     <h1 className="text-4xl font-bold text-white tracking-tight">Auto-Documentation</h1>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Generate comprehensive documents directly from your architectural memory threads using Groq AI.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                     <div className="space-y-6">
                        <div className="card-noir p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
                           <h3 className="text-sm font-semibold text-gray-200 mb-4">1. Select Document Type</h3>
                           <select 
                             value={docFormat}
                             onChange={(e) => setDocFormat(e.target.value)}
                             className="w-full bg-[#050505] border border-white/[0.06] text-white px-4 py-3 rounded-xl font-medium text-sm focus:outline-none focus:border-[#444444] focus:bg-[#0a0a0a] focus:ring-4 focus:ring-white/[0.02] transition-all cursor-pointer"
                           >
                             <option value="adr">Architecture Decision Record (ADR)</option>
                             <option value="onboarding">Onboarding Guide</option>
                             <option value="changelog">Changelog</option>
                           </select>
                        </div>
                        
                        <div className="card-noir p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
                           <h3 className="text-sm font-semibold text-gray-200 mb-4">2. Select Source Threads</h3>
                           <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                              {availableThreads.map(thread => (
                                <div 
                                  key={thread._id} 
                                  onClick={() => toggleThread(thread._id)}
                                  className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedThreadIds.includes(thread._id) ? 'bg-[#FF5733]/10 border-[#FF5733]/30 text-white' : 'bg-white/[0.02] border-white/[0.05] text-gray-400 hover:bg-white/[0.04]'}`}
                                >
                                  <div className="flex items-center justify-between">
                                     <span className="text-sm font-medium truncate">{thread.title}</span>
                                     {selectedThreadIds.includes(thread._id) && <CheckCircle2 className="w-4 h-4 text-[#FF5733] shrink-0" />}
                                  </div>
                                </div>
                              ))}
                              {availableThreads.length === 0 && <p className="text-xs text-gray-500">Loading threads...</p>}
                           </div>
                        </div>

                        <button 
                          onClick={handleGenerateDoc}
                          disabled={selectedThreadIds.length === 0 || generatingDoc}
                          className="w-full h-12 bg-[#FF5733] text-black text-xs font-bold uppercase tracking-widest hover:bg-[#ff6c4d] transition-all rounded-xl shadow-[0_0_20px_rgba(255,87,51,0.2)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                        >
                          {generatingDoc ? (
                             <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> Generating...</>
                          ) : "Generate Document"}
                        </button>
                     </div>

                     <div className="card-noir rounded-2xl border border-white/[0.05] bg-white/[0.01] flex flex-col h-[500px]">
                        <div className="px-4 py-3 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                           <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Output Preview</span>
                           {generatedDoc && (
                             <button 
                               onClick={() => copyToClipboard(generatedDoc)}
                               className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                             >
                               {copiedText === generatedDoc ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                               {copiedText === generatedDoc ? "Copied" : "Copy Markdown"}
                             </button>
                           )}
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
                           {generatedDoc ? (
                             <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                               {generatedDoc}
                             </pre>
                           ) : (
                             <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                <BookText className="w-12 h-12 text-gray-500 mb-4" />
                                <p className="text-sm font-medium text-gray-400">No document generated yet</p>
                                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Select threads and click generate to create a new document.</p>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
