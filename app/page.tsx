import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-brand-primary/30 selection:text-brand-primary">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-primary/30 rounded-full blur-[128px] animate-pulse-slow" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[128px] animate-float" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">ContextVault</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/60">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="#docs" className="hover:text-foreground transition-colors">Docs</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hover:text-brand-primary transition-colors">Log In</Link>
            <Link href="/signup" className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold mb-8 animate-bounce-subtle">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            NOW IN CLOSED BETA
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl leading-[1.1]">
            Your AI's Long-Term Memory. <br />
            <span className="text-gradient">One Timeline. Every Model.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-foreground/60 mb-12 max-w-2xl leading-relaxed">
            Stop losing context when switching between ChatGPT, Claude, and Gemini. 
            ContextVault captures every prompt, response, and decision into a universal memory layer.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <Link href="/signup" className="px-8 py-4 rounded-2xl bg-brand-primary text-white font-bold text-lg hover:bg-brand-primary/90 transition-all active:scale-95 shadow-2xl shadow-brand-primary/30">
              Start Your Memory Vault
            </Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-2xl glass border border-white/10 font-bold text-lg hover:bg-white/5 transition-all active:scale-95">
              Explore Demo
            </Link>
          </div>

          {/* Feature Preview Card */}
          <div className="mt-24 w-full max-w-5xl rounded-3xl p-1 bg-gradient-to-br from-white/10 via-brand-primary/20 to-brand-secondary/20 shadow-2xl">
            <div className="bg-[#020617] rounded-[22px] overflow-hidden border border-white/5">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>
                <div className="flex-1 text-center text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
                  Memory Explorer — Workspace: Project-X
                </div>
              </div>
              <div className="p-8 text-left">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-brand-primary text-xs font-bold">JD</span>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-foreground/40 uppercase tracking-wider">User @ sarah-dev</div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-foreground/80 leading-relaxed">
                        "How did we implement the OAuth2 flow in our FastAPI backend? Claude seems to have forgotten."
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="text-sm font-semibold text-brand-primary uppercase tracking-wider">ContextVault Memory Retrieval</div>
                      <div className="p-5 rounded-2xl glass border border-brand-primary/20 text-foreground/90 leading-relaxed">
                        <p className="mb-4">Found relevant conversation from **April 15, 2026** (ChatGPT-4):</p>
                        <div className="bg-black/40 rounded-xl p-4 font-mono text-sm text-brand-primary/90 border border-white/5">
                          "We decided to use FastAPI + Redis for session store. JWT tokens are signed with RS256..."
                        </div>
                        <div className="mt-4 flex gap-4 text-xs font-medium">
                          <span className="px-2 py-1 rounded bg-white/5 text-foreground/40">Model: GPT-4</span>
                          <span className="px-2 py-1 rounded bg-white/5 text-foreground/40">Platform: ChatGPT</span>
                          <span className="px-2 py-1 rounded bg-brand-primary/20 text-brand-primary">Confidence: 98%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl glass border border-white/5 hover:border-brand-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Universal Capture</h3>
              <p className="text-foreground/60 leading-relaxed">
                Automatically sync conversations from ChatGPT, Claude, and Gemini via our browser extension and CLI.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl glass border border-white/5 hover:border-brand-secondary/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Hybrid Search</h3>
              <p className="text-foreground/60 leading-relaxed">
                Find anything instantly with vector-powered semantic search. ContextVault understands intent, not just keywords.
              </p>
            </div>

            <div className="p-8 rounded-3xl glass border border-white/5 hover:border-brand-accent/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 11V5a2 2 0 114 0v1a8 8 0 008 8v1M3 13a9 9 0 0118 0v.1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Context Injection</h3>
              <p className="text-foreground/60 leading-relaxed">
                Auto-inject relevant past discussions into your current chat. Your AI always has the full picture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="text-foreground/40 text-sm mb-4">
            &copy; 2026 ContextVault. Your AI's Long-Term Memory.
          </div>
          <div className="flex items-center justify-center gap-6">
            <Link href="/privacy" className="text-foreground/40 hover:text-foreground text-xs">Privacy Policy</Link>
            <Link href="/terms" className="text-foreground/40 hover:text-foreground text-xs">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
