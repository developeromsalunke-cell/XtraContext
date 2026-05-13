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
  Search
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733] selection:text-black font-sans overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/[0.05] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-white uppercase leading-none">XTRACONTEXT</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <Link href="#architecture" className="hover:text-white transition-all">ARCHITECTURE</Link>
            <Link href="/security" className="hover:text-white transition-all">SECURITY</Link>
            <Link href="/dashboard/docs" className="hover:text-white transition-all">DOCUMENTATION</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-6 py-2.5 rounded text-[11px] font-bold uppercase tracking-widest text-[#FF5733] border border-white/10 hover:border-[#FF5733] transition-all"
            >
              LOG IN
            </Link>
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
            The AI Memory Vault <br/>
            <span className="text-[#FF5733]">For Your Stack.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
            Give your AI agents persistent architectural memory. XtraContext automatically logs, indexes, and retrieves every critical decision your AI makes via the Model Context Protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link 
              href="/signup" 
              className="px-8 py-4 rounded-lg bg-[#FF5733] text-black font-bold text-sm uppercase tracking-widest hover:bg-[#ff6c4d] hover:scale-105 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,87,51,0.3)]"
            >
              INITIALIZE VAULT
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
                <p className="mt-4 text-xs font-medium text-gray-500 text-center w-32">Cursor / Claude <br/> Windsurf</p>
              </div>

              {/* Node 2: MCP Server */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full bg-[#FF5733]/10 border border-[#FF5733] flex flex-col items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,87,51,0.25)] relative backdrop-blur-sm animate-pulse-slow">
                  <Cpu className="w-10 h-10 text-[#FF5733]" />
                  <span className="text-[10px] font-bold uppercase text-[#FF5733] tracking-widest mt-1">MCP Protocol</span>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-400 text-center w-40">Handles secure auth & <br/> translates tools</p>
              </div>

              {/* Node 3: XtraContext Vault */}
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-2xl bg-[#111] border border-white/10 flex flex-col items-center justify-center gap-2 shadow-2xl relative">
                  <Database className="w-8 h-8 text-white" />
                  <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">Vault</span>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-500 text-center w-32">Telemetry <br/> & Semantics</p>
              </div>

            </div>
          </div>
        </div>
      </main>

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

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/[0.05] bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
          <div>
            <span className="text-2xl font-bold tracking-tight text-white uppercase leading-none mb-6 block">XTRACONTEXT</span>
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
