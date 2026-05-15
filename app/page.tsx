import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Database,
  Lock,
  Zap,
  Network,
  Terminal,
  Cpu,
  Search,
  Shield,
  Activity,
  Workflow,
  Globe,
  Layers,
  Share2
} from "lucide-react";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733] selection:text-black font-sans overflow-x-hidden">

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center overflow-hidden">
               <img src="/xtracontext.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white uppercase leading-none transition-colors">
              <span className="text-[#FF5733]">XTRA</span>CONTEXT
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <Link href="#architecture" className="hover:text-white transition-all">ARCHITECTURE</Link>
            <Link href="/security" className="hover:text-white transition-all">SECURITY</Link>
            <Link href="/dashboard/docs" className="hover:text-white transition-all">DOCUMENTATION</Link>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded text-[11px] font-bold uppercase tracking-widest text-white border border-[#FF5733] bg-[#FF5733]/10 hover:bg-[#FF5733]/20 transition-all"
              >
                GO TO DASHBOARD
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 rounded text-[11px] font-bold uppercase tracking-widest text-[#FF5733] border border-white/10 hover:border-[#FF5733] transition-all"
              >
                LOG IN
              </Link>
            )}
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded bg-[#FF5733] text-black text-[11px] font-bold uppercase tracking-widest hover:bg-[#ff6c4d] transition-all"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 px-6 z-10 min-h-screen flex flex-col items-center justify-center text-center">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />

        <div className="max-w-5xl mx-auto w-full relative z-10">
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-bold tracking-tighter leading-[0.95] mb-8">
            Give Your AI <br />
            <span className="text-[#FF5733]">Infinite Memory.</span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
            Give your AI agents persistent architectural memory. XtraContext automatically logs, indexes, and retrieves every critical decision your AI makes via the Model Context Protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link
              href={session ? "/dashboard" : "/signup"}
              className="px-8 py-4 rounded-lg bg-[#FF5733] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#ff6c4d] hover:scale-105 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,87,51,0.3)]"
            >
              {session ? "ACCESS YOUR VAULT" : "INITIALIZE VAULT"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/docs"
              className="px-8 py-4 rounded-lg border border-white/10 text-white font-bold text-sm uppercase tracking-widest hover:bg-white/[0.04] hover:border-white/20 transition-all"
            >
              READ THE DOCS
            </Link>
          </div>

          {/* Architectural Diagram */}
          <div className="relative mt-16 max-w-4xl mx-auto hidden md:block select-none pointer-events-none">
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-[#0A0A0A] via-[#FF5733]/50 to-[#0A0A0A] -translate-y-1/2 z-0" />

            <div className="flex justify-between items-center relative z-10">

              {/* Node 1: AI Client */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-[#111] border border-white/10 flex flex-col items-center justify-center gap-2 shadow-2xl relative">
                  <Terminal className="w-8 h-8 text-white" />
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">AI IDE</span>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-500 text-center w-32">Cursor / Claude <br /> Windsurf</p>
              </div>

              {/* Node 2: MCP Server */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-[#FF5733]/10 border border-[#FF5733] flex flex-col items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,87,51,0.25)] relative backdrop-blur-sm animate-pulse-slow">
                  <Cpu className="w-10 h-10 text-[#FF5733]" />
                  <span className="text-[10px] font-bold uppercase text-[#FF5733] tracking-widest mt-1">MCP Protocol</span>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center w-40">Handles secure auth & <br /> translates tools</p>
              </div>

              {/* Node 3: XtraContext Vault */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-[#111] border border-white/10 flex flex-col items-center justify-center gap-2 shadow-2xl relative">
                  <Database className="w-8 h-8 text-white" />
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Vault</span>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-500 text-center w-32">Telemetry <br /> & Semantics</p>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Company Marquee */}
      <div className="w-full py-12 border-y border-white/[0.05] bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">Trusted by Infrastructure Leaders</p>
        </div>
        <div className="flex relative items-center">
          <div className="animate-marquee flex gap-12 md:gap-24 items-center whitespace-nowrap">
            {[
              "XTRASECURITY", "NOIR", "RADIANT", "ALPHA CODE", "DELTA OPS", "SIGMA AI", "OMEGA CLOUD",
              "XTRASECURITY", "NOIR", "RADIANT", "ALPHA CODE", "DELTA OPS", "SIGMA AI", "OMEGA CLOUD"
            ].map((company, i) => (
              <span key={i} className="text-xl md:text-3xl font-black text-white/20 hover:text-[#FF5733]/40 transition-colors tracking-tighter cursor-default">
                {company}
              </span>
            ))}
          </div>
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
        </div>
      </div>

      {/* Live Context Stream */}
      <section aria-label="System Activity" className="w-full bg-[#0A0A0A] py-4 px-6 border-b border-white/[0.05] hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-8 overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-2 text-[9px] font-bold text-[#FF5733] uppercase tracking-[0.2em]">
            <Activity className="w-3 h-3 animate-pulse" aria-hidden="true" />
            Live Context Stream
          </div>
          <div className="flex gap-12 text-[9px] font-mono text-gray-600 uppercase tracking-widest animate-[marquee_20s_linear_infinite]">
            <span>[02:14:55] INVOKING_MCP_TOOL: xtracontext.save_snapshot</span>
            <span>[02:14:58] MEMORY_COMMITTED: d830da3d-d056...</span>
            <span>[02:15:02] CONTEXT_INJECTED: Cursor_IDE_Instance_7</span>
            <span>[02:15:05] SYNC_COMPLETE: Region_US_East_1</span>
            <span>[02:15:10] SCHEMA_VALIDATED: prisma.schema.v2</span>
            <span>[02:15:15] LOGGING_DECISION: refactor.auth_middleware</span>
            <span>[02:14:55] INVOKING_MCP_TOOL: xtracontext.save_snapshot</span>
            <span>[02:14:58] MEMORY_COMMITTED: d830da3d-d056...</span>
            <span>[02:15:02] CONTEXT_INJECTED: Cursor_IDE_Instance_7</span>
            <span>[02:15:05] SYNC_COMPLETE: Region_US_East_1</span>
            <span>[02:15:10] SCHEMA_VALIDATED: prisma.schema.v2</span>
            <span>[02:15:15] LOGGING_DECISION: refactor.auth_middleware</span>
          </div>
        </div>
      </section>

      {/* Solid Orange Impact Section */}
      <section className="w-full bg-[#FF5733] py-32 px-6 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight leading-[1.1]">
            Stop losing architectural context every time you close a chat window.
          </h2>
        </div>
      </section>

      {/* The Problem & Solution Section */}
      <section className="py-32 px-6 bg-[#0A0A0A] border-t border-white/[0.05] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
              AI is smart. <br />
              <span className="text-gray-500">But it has amnesia.</span>
            </h2>
            <div className="w-16 h-1 bg-[#FF5733] mb-8" />
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              When you use tools like Cursor, Windsurf, or Claude Desktop, they are incredibly capable. But the moment you start a new chat, they forget everything. They forget why you chose a specific database, how you structured your API, or what bugs you fixed yesterday.
            </p>
            <p className="text-white font-medium text-lg leading-relaxed">
              XtraContext acts as a persistent, long-term brain for your AI agents, solving amnesia entirely through the Model Context Protocol.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="p-8 rounded-2xl bg-[#111] border border-white/[0.05] shadow-2xl relative overflow-hidden group hover:border-[#FF5733]/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5733]/5 blur-[50px] rounded-full group-hover:bg-[#FF5733]/10 transition-colors" />
              <Database className="w-8 h-8 text-[#FF5733] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">1. The AI Writes Memory</h3>
              <p className="text-gray-400 text-sm leading-relaxed">When the AI makes a major architectural decision or solves a complex bug, it uses our MCP tools to log that exact context securely into your vault.</p>
            </div>
            <div className="p-8 rounded-2xl bg-[#111] border border-white/[0.05] shadow-2xl relative overflow-hidden group hover:border-[#FF5733]/30 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5733]/5 blur-[50px] rounded-full group-hover:bg-[#FF5733]/10 transition-colors" />
              <Search className="w-8 h-8 text-[#FF5733] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">2. The AI Reads Memory</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Before building a new feature, the AI automatically searches the vault to recall your project's history, ensuring it doesn't break existing patterns or repeat past mistakes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="architecture" className="py-32 px-6 bg-[#0A0A0A] border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <div className="w-16 h-1 bg-[#FF5733] mb-8 mx-auto" />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white uppercase">Infrastructure Matrix</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Universal Sync",
                desc: "Captures every decision from all major LLMs into a single high-fidelity, sovereign timeline. Zero lock-in.",
                icon: Zap
              },
              {
                title: "Semantic Index",
                desc: "AI agents can search your history by architectural intent and neural patterns, retrieving context dynamically.",
                icon: Network
              },
              {
                title: "Secure Vaults",
                desc: "Enterprise-grade isolation for your AI's long-term memory. Fully encrypted at rest and in transit.",
                icon: Lock
              }
            ].map((f, i) => (
              <div key={i} className="group p-10 border border-white/[0.05] bg-[#141414] rounded-2xl hover:border-[#FF5733]/50 transition-all duration-300">
                <f.icon className="w-10 h-10 text-[#FF5733] mb-8" />
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Diagram: The Context Cycle */}
      <section className="py-32 px-6 bg-[#070707] border-t border-white/[0.05] relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 lg:order-1 min-h-[500px] flex items-center justify-center">
              <div className="relative w-full max-w-lg aspect-square">
                {/* SVG Connections Layer */}
                <svg className="absolute inset-0 w-full h-full -z-0 pointer-events-none" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="lineGradient" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FF5733" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#FF5733" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#FF5733" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {/* Tree/Graph Lines */}
                  <line x1="200" y1="200" x2="100" y2="100" stroke="#FF5733" strokeOpacity="0.6" strokeWidth="2" className="animate-flow" />
                  <line x1="200" y1="200" x2="300" y2="100" stroke="#FF5733" strokeOpacity="0.6" strokeWidth="2" className="animate-flow" />
                  <line x1="200" y1="200" x2="100" y2="300" stroke="#FF5733" strokeOpacity="0.6" strokeWidth="2" className="animate-flow" />
                  <line x1="200" y1="200" x2="300" y2="300" stroke="#FF5733" strokeOpacity="0.6" strokeWidth="2" className="animate-flow" />

                  {/* Glowing Overlay Lines */}
                  <line x1="200" y1="200" x2="100" y2="100" stroke="#FF5733" strokeOpacity="0.2" strokeWidth="12" className="blur-xl" />
                  <line x1="200" y1="200" x2="300" y2="100" stroke="#FF5733" strokeOpacity="0.2" strokeWidth="12" className="blur-xl" />
                  <line x1="200" y1="200" x2="100" y2="300" stroke="#FF5733" strokeOpacity="0.2" strokeWidth="12" className="blur-xl" />
                  <line x1="200" y1="200" x2="300" y2="300" stroke="#FF5733" strokeOpacity="0.2" strokeWidth="12" className="blur-xl" />

                  {/* Sub-connections */}
                  <line x1="100" y1="100" x2="50" y2="100" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                  <line x1="300" y1="100" x2="350" y2="100" stroke="white" strokeOpacity="0.4" strokeWidth="1" />
                </svg>

                {/* Central Vault Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-24 h-24 rounded-2xl bg-[#0A0A0A] border-2 border-[#FF5733] flex items-center justify-center shadow-[0_0_50px_rgba(255,87,51,0.2)] animate-pulse-slow">
                    <Database className="w-10 h-10 text-[#FF5733]" />
                  </div>
                  <div className="absolute -inset-4 bg-[#FF5733]/5 blur-[30px] rounded-full -z-10" />
                </div>

                {/* Branch 1: Ingestion */}
                <div className="absolute top-[80px] left-[80px] -translate-x-1/2 -translate-y-1/2 z-10 group">
                  <div className="w-16 h-16 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center hover:border-[#FF5733]/50 transition-all shadow-2xl">
                    <Terminal className="w-6 h-6 text-white group-hover:text-[#FF5733]" />
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AI Client</span>
                </div>

                {/* Branch 2: Analysis */}
                <div className="absolute top-[80px] right-[80px] translate-x-1/2 -translate-y-1/2 z-10 group">
                  <div className="w-16 h-16 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center hover:border-[#FF5733]/50 transition-all shadow-2xl">
                    <Activity className="w-6 h-6 text-white group-hover:text-[#FF5733]" />
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Neural Mapping</span>
                </div>

                {/* Branch 3: Security */}
                <div className="absolute bottom-[80px] left-[80px] -translate-x-1/2 translate-y-1/2 z-10 group">
                  <div className="w-16 h-16 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center hover:border-[#FF5733]/50 transition-all shadow-2xl">
                    <Shield className="w-6 h-6 text-white group-hover:text-[#FF5733]" />
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Enterprise Security</span>
                </div>

                {/* Branch 4: Global Mesh */}
                <div className="absolute bottom-[80px] right-[80px] translate-x-1/2 translate-y-1/2 z-10 group">
                  <div className="w-16 h-16 rounded-xl bg-[#111] border border-white/10 flex items-center justify-center hover:border-[#FF5733]/50 transition-all shadow-2xl">
                    <Globe className="w-6 h-6 text-white group-hover:text-[#FF5733]" />
                  </div>
                  <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-gray-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Global Sync</span>
                </div>

                {/* Floating "Memory Nodes" decoration */}
                <div className="absolute top-[20%] left-[45%] w-2 h-2 rounded-full bg-[#FF5733]/30 blur-[2px] animate-ping" />
                <div className="absolute bottom-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-white/20 blur-[1px]" />
                <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-[#FF5733]/50" />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[#FF5733] font-bold text-xs uppercase tracking-[0.4em] mb-6 block">Deep Architecture</span>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
                The Neural <br />
                <span className="text-gray-500">Context Engine</span>
              </h2>
              <div className="space-y-12">
                {[
                  {
                    title: "Automatic Persistence",
                    desc: "Every interaction is serialized and committed to the vault in real-time, creating an immutable chain of thought.",
                    icon: Layers
                  },
                  {
                    title: "Global Distribution",
                    desc: "Access your architectural memory from any IDE, CI/CD pipeline, or staging environment instantly.",
                    icon: Globe
                  },
                  {
                    title: "Multi-Model Handshake",
                    desc: "Hand off context between Claude, GPT, and Llama without losing a single line of logic.",
                    icon: Share2
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#111] border border-white/10 flex items-center justify-center group-hover:border-[#FF5733]/50 transition-colors">
                      <item.icon className="w-5 h-5 text-gray-400 group-hover:text-[#FF5733] transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/[0.05] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center overflow-hidden">
                <img src="/xtracontext.png" alt="Logo" className="w-14 h-14 object-contain" />
              </div>
              <span className="text-3xl font-bold tracking-tight text-white uppercase leading-none">
                <span className="text-[#FF5733]">XTRA</span>CONTEXT
              </span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              Defining the utility model for AI context infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Platform</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-500">
                <Link href="#architecture" className="hover:text-[#FF5733] transition-colors">Architecture</Link>
                <Link href="/security" className="hover:text-[#FF5733] transition-colors">Security</Link>
                <Link href="/dashboard/docs" className="hover:text-[#FF5733] transition-colors">Documentation</Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-6">Company</h4>
              <div className="flex flex-col gap-3 text-sm text-gray-500">
                <Link href="/about" className="hover:text-[#FF5733] transition-colors">About Us</Link>
                <Link href="#" className="hover:text-[#FF5733] transition-colors">Careers</Link>
                <Link href="/contact" className="hover:text-[#FF5733] transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            &copy; 2026 XTRACONTEXT. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
