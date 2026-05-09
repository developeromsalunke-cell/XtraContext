"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AccessTokensPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/v1/keys");
      const data = await res.json();
      setKeys(data.keys || []);
    } catch (error) {
      console.error("Failed to fetch keys");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    
    setCreating(true);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        body: JSON.stringify({ label: newLabel }),
      });
      const data = await res.json();
      if (data.key) {
        setGeneratedKey(data.key);
        setNewLabel("");
        fetchKeys();
      }
    } catch (error) {
      alert("Failed to generate key");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this access token? MCP connections using it will fail immediately.")) return;

    try {
      await fetch(`/api/v1/keys/${id}`, { method: "DELETE" });
      fetchKeys();
    } catch (error) {
      alert("Failed to revoke key");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-12 bg-noir-grid font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-20">
          <Link href="/dashboard" className="mono-label text-foreground/40 hover:text-foreground transition-colors mb-8 inline-block uppercase tracking-widest text-[10px]">
            &larr; Return to Hub
          </Link>
          <h1 className="text-6xl font-heading font-black uppercase tracking-tighter mb-4">
            Access Tokens
          </h1>
          <p className="mono-label text-foreground/40 uppercase tracking-[0.3em] text-xs">
            Architectural Security & Agent Connectivity
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Create Key Section */}
          <div className="lg:col-span-4">
            <section className="p-10 border border-foreground/10 bg-background noir-card sticky top-12">
              <h2 className="mono-label text-foreground mb-8 tracking-[0.2em] font-bold">Issue New Token</h2>
              <form onSubmit={handleCreate} className="space-y-8">
                <div>
                  <label className="mono-label text-[10px] text-foreground/30 uppercase mb-3 block">Token Label</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="e.g. Claude Desktop, CLI, CI/CD"
                    className="w-full bg-foreground/[0.03] border border-foreground/10 p-4 font-mono text-sm focus:outline-none focus:border-foreground transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="w-full py-5 bg-foreground text-background font-black uppercase tracking-[0.2em] text-[10px] hover:invert transition-all disabled:opacity-50"
                >
                  {creating ? "Generating..." : "Generate Access Token"}
                </button>
              </form>

              {generatedKey && (
                <div className="mt-10 p-6 bg-foreground text-background border border-foreground/20 animate-in fade-in slide-in-from-top-4 duration-500">
                  <p className="mono-label text-[9px] uppercase mb-4 opacity-70">New Key Generated (Save it now!)</p>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <code className="font-mono text-xs break-all select-all font-bold">{generatedKey}</code>
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedKey);
                      alert("Key copied to clipboard");
                    }}
                    className="w-full py-3 border border-background/20 text-[9px] font-black uppercase tracking-widest hover:bg-background hover:text-foreground transition-all"
                  >
                    Copy Key
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* List Keys Section */}
          <div className="lg:col-span-8">
            <section>
              <h2 className="mono-label text-foreground mb-12 tracking-[0.2em] font-bold uppercase">Active Identity Fragments</h2>
              
              {loading ? (
                <div className="py-20 flex justify-center">
                  <div className="w-12 h-1 bg-foreground/20 animate-pulse" />
                </div>
              ) : keys.length === 0 ? (
                <div className="py-32 text-center border border-foreground/5 bg-foreground/[0.01]">
                   <p className="mono-label text-foreground/20 uppercase tracking-[0.4em]">No active tokens found.</p>
                </div>
              ) : (
                <div className="space-y-px bg-foreground/10">
                  {keys.map((key) => (
                    <div key={key.id} className="bg-background p-8 border border-foreground/10 flex items-center justify-between group hover:bg-foreground/[0.01] transition-all">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-heading font-bold uppercase text-lg">{key.label}</h3>
                          <span className="mono-label text-[9px] px-2 py-0.5 bg-foreground/5 text-foreground/40">ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-4 mono-label text-[10px] text-foreground/30">
                          <span>PREFIX: {key.prefix}</span>
                          <span className="w-1 h-1 bg-foreground/10 rounded-full" />
                          <span>CREATED: {new Date(key.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleRevoke(key.id)}
                        className="opacity-0 group-hover:opacity-100 px-6 py-3 border border-foreground/10 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="mt-20 p-12 border border-foreground/5 bg-foreground/[0.02]">
               <h3 className="mono-label text-foreground/60 mb-6 font-bold uppercase tracking-widest text-[11px]">Security Protocol</h3>
               <p className="text-[12px] leading-relaxed text-foreground/40 font-medium">
                 Access tokens provide secure, audited connectivity to your ContextVault without exposing internal database structures. 
                 Always issue unique tokens for separate environments. Tokens are hashed using bcrypt-10; raw values are never stored.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
