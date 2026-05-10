import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden blueprint-grid">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-700 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
              <span className="text-black font-black text-lg font-heading">X</span>
            </div>
            <span className="text-xl font-heading font-black tracking-tight text-white uppercase">XtraContext</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">
            <Link href="#problem" className="hover:text-white transition-colors">Manifesto</Link>
            <Link href="#features" className="hover:text-white transition-colors">Capabilities</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Economics</Link>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors font-mono">Access Login</Link>
            <Link href="/signup" className="px-6 py-2.5 rounded-md bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all active:scale-95">
              Initialize
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-md border border-gray-600 text-gray-400 text-[10px] font-bold mb-12 tracking-[0.3em] font-mono">
            PROTOCOL v2.4.0 — SYSTEM ONLINE
          </div>
          
          <h1 className="text-6xl md:text-9xl font-heading font-black tracking-tighter mb-12 leading-[0.85] text-white">
            GIT FOR <br />
            AI CONTEXT.
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-20 max-w-2xl leading-relaxed font-medium">
            Your AI's Long-Term Memory. One Timeline. Every Model. 
            Universal context storage for high-performance engineers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-40">
            <Link href="/signup" className="px-10 py-5 rounded-md bg-white text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all">
              Start Your Memory Vault
            </Link>
            <Link href="/dashboard" className="px-10 py-5 rounded-md border border-gray-600 font-bold text-xs uppercase tracking-[0.2em] hover:border-white transition-all text-gray-400 hover:text-white">
              Explore Demo
            </Link>
          </div>

          {/* Minimalist Feature Card */}
          <div className="w-full max-w-5xl rounded-lg border border-gray-700 bg-gray-900 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-700" />
                <div className="w-2 h-2 rounded-full bg-gray-700" />
                <div className="w-2 h-2 rounded-full bg-gray-700" />
              </div>
              <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-[0.4em]">
                Memory Explorer — Project: Nexus-Core
              </div>
              <div className="w-8" />
            </div>
            
            <div className="p-10 md:p-16 text-left space-y-12 bg-black">
               <div className="flex gap-8">
                  <div className="w-12 h-12 rounded bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0">
                    <span className="text-gray-400 text-xs font-black">AD</span>
                  </div>
                  <div className="space-y-4 pt-1">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] font-mono">User Input</div>
                    <div className="p-6 rounded-lg bg-gray-900 border border-gray-700 text-gray-300 leading-relaxed font-medium">
                      "What was the conclusion of our database schema review in Claude?"
                    </div>
                  </div>
               </div>

               <div className="flex gap-8">
                  <div className="w-12 h-12 rounded bg-white flex items-center justify-center shrink-0 shadow-lg">
                    <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="space-y-4 pt-1 flex-1">
                    <div className="text-[10px] font-bold text-white uppercase tracking-[0.2em] font-mono">XtraContext Retrieval</div>
                    <div className="p-6 rounded-lg border border-white/20 bg-gray-900 space-y-6">
                       <p className="text-white font-bold uppercase tracking-tight">Match Found (98.4%)</p>
                       <div className="bg-black rounded-md p-5 font-mono text-sm text-gray-300 border border-gray-700 leading-relaxed">
                          "DECISION: Use **Astra DB** for global horizontal scale. Migrating from local PostgreSQL."
                       </div>
                       <div className="flex gap-4">
                          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">Model: Claude 3</span>
                          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">Status: Synced</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-40 px-8 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { 
                title: "Universal Sync", 
                desc: "Captures every decision from ChatGPT, Claude, and Gemini into a single timeline.",
                icon: "M13 10V3L4 14h7v7l9-11h-7z"
              },
              { 
                title: "Semantic Index", 
                desc: "Search your AI history by architectural intent, not just keywords.",
                icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              },
              { 
                title: "Agent Bridge", 
                desc: "Direct integration with MCP. Let your AI agents read and write to their own history.",
                icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 11V5a2 2 0 114 0v1a8 8 0 008 8v1M3 13a9 9 0 0118 0v.1"
              }
            ].map((f, i) => (
              <div key={i} className="group">
                <div className="w-12 h-12 rounded bg-gray-800 border border-gray-700 flex items-center justify-center mb-10 group-hover:bg-white group-hover:text-black transition-all">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white uppercase tracking-tight">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed font-medium text-lg">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-gray-700 text-center bg-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded">
              <span className="text-black font-black text-sm font-heading">X</span>
            </div>
            <span className="text-lg font-heading font-black tracking-tight text-white uppercase">XtraContext</span>
          </div>
          <div className="text-gray-500 text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
            &copy; 2026 XTRACONTEXT PROTOCOL. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center justify-center gap-8 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-600">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
