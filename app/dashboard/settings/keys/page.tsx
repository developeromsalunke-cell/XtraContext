"use client";

import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import Link from "next/link";
import { 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  ShieldAlert, 
  ChevronLeft, 
  Search,
  Lock,
  Eye,
  CheckCircle2,
  Calendar,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

export default function APIKeysPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyLabel, setNewKeyLabel] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const res = await fetch("/api/v1/keys");
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (error) {
      console.error("Failed to fetch keys", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel) return;
    setCreating(true);
    const toastId = toast.loading("Generating vault key...");
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        body: JSON.stringify({ label: newKeyLabel }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.key);
        await fetchKeys();
        toast.success("Key generated successfully", { id: toastId });
      } else {
        toast.error("Failed to generate key", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to create key", error);
      toast.error("An error occurred during key generation", { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return;
    const toastId = toast.loading("Revoking key...");
    try {
      const res = await fetch(`/api/v1/keys?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchKeys();
        toast.success("Key revoked", { id: toastId });
      } else {
        toast.error("Failed to revoke key", { id: toastId });
      }
    } catch (error) {
      console.error("Failed to revoke key", error);
      toast.error("An error occurred while revoking key", { id: toastId });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A] overflow-y-auto p-8 lg:p-12 custom-scrollbar relative">
          {/* Subtle Background Elements Removed */}

          <div className="max-w-5xl mx-auto w-full relative z-10">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <Link 
                  href="/dashboard/settings" 
                  className="group flex items-center gap-2 text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em] hover:text-white transition-colors mb-8"
                >
                  <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                  Return to Settings
                </Link>
                <div className="flex items-center gap-4 mb-3">
                   <div className="w-2 h-2 rounded-full bg-[#FF5733] shadow-[0_0_8px_rgba(255,87,51,0.5)]" />
                   <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.3em]">Access Management</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gradient">API Keys</h1>
              </div>

              <button
                onClick={() => { setGeneratedKey(null); setNewKeyLabel(""); setShowCreateModal(true); }}
                className="btn-premium px-8 h-12 shadow-[0_0_20px_rgba(255,87,51,0.15)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Generate Vault Key
              </button>
            </header>

            <div className="space-y-8">
               {loading ? (
                 <div className="space-y-4">
                   {Array(3).fill(0).map((_, i) => (
                     <div key={i} className="h-28 rounded-2xl bg-[#FF5733]/10 border border-[#FF5733]/20 animate-pulse" />
                   ))}
                 </div>
               ) : keys.length === 0 ? (
                 <div className="py-32 text-center border border-dashed border-white/10 rounded-[40px] bg-white/[0.01]">
                    <Key className="w-12 h-12 text-gray-700 mx-auto mb-6 opacity-30" />
                    <p className="text-base font-semibold text-gray-400 uppercase tracking-widest">No active API keys identified.</p>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Issue a key to grant external agents access to your vault.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {keys.map((key) => (
                     <div key={key.id} className="p-6 lg:p-8 bg-[#111111] border border-white/[0.06] rounded-2xl group hover:border-[#FF5733]/30 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center text-[#FF5733] shrink-0">
                              <Key className="w-5 h-5" />
                           </div>
                           <div>
                              <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-[#FF5733] transition-colors mb-1">{key.label}</h3>
                              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                 <Calendar className="w-3.5 h-3.5" />
                                 Issued {new Date(key.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-wrap md:flex-nowrap items-center gap-4 lg:gap-6">
                           <div className="flex items-center gap-2 font-mono text-[13px] text-gray-400 bg-black px-4 py-2.5 rounded-lg border border-white/5">
                              <span className="opacity-40">cv_</span>
                              <span className="text-gray-200 font-bold">{key.prefix}</span>
                              <span className="opacity-20">...••••••••</span>
                           </div>
                           <button 
                             onClick={() => handleRevokeKey(key.id)}
                             className="h-10 px-5 flex items-center gap-2 bg-red-500/10 text-red-400 text-[11px] font-bold uppercase tracking-widest rounded border border-red-500/20 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                           >
                             <Trash2 className="w-4 h-4" />
                             Revoke
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <section className="mt-20 glass-card p-10 bg-[#FF5733]/[0.01] border-[#FF5733]/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5733]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert className="w-5 h-5 text-[#FF5733]" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Security Protocol</h3>
               </div>
               <p className="text-gray-500 text-[13px] leading-relaxed max-w-3xl font-medium">
                  API keys provide administrative access to your XtraContext vault. Never share these keys or expose them in client-side code. Use these tokens specifically for configuring <span className="text-white font-bold">Model Context Protocol (MCP)</span> servers or background synchronization nodes. Issue unique keys for every environment to maintain granular audit logs.
               </p>
            </section>
          </div>
        </main>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#0A0A0A]/80 backdrop-blur-md" onClick={() => setShowCreateModal(false)} />
           <div className="w-full max-w-md glass-card p-10 space-y-8 animate-in fade-in zoom-in duration-300 relative z-10 overflow-hidden">
              {!generatedKey ? (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF5733] via-[#ff6c4d] to-[#FF5733]" />
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Generate Key</h2>
                    <p className="text-gray-500 text-xs font-medium">Identify this access token with a unique label.</p>
                  </div>

                  <form onSubmit={handleCreateKey} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-[0.2em]">Key Label Identity</label>
                        <div className="relative">
                          <input
                            autoFocus
                            required
                            type="text"
                            placeholder="e.g. Claude Desktop Node"
                            className="input-noir w-full font-medium text-[13px] pl-12"
                            value={newKeyLabel}
                            onChange={(e) => setNewKeyLabel(e.target.value)}
                          />
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                          className="flex-1 h-12 rounded border border-white/10 hover:border-[#FF5733] text-[#FF5733] text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={creating}
                          type="submit"
                          className="flex-[2] h-12 rounded bg-[#FF5733] hover:bg-[#ff6c4d] text-black text-[11px] font-bold uppercase tracking-widest transition-all flex items-center justify-center shadow-[0_0_20px_rgba(255,87,51,0.15)] disabled:opacity-50"
                        >
                          {creating ? "Generating..." : "Generate Key"}
                        </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-[#FF5733]" />
                  <div className="flex flex-col items-center text-center space-y-4">
                     <div className="w-16 h-16 rounded-[2rem] bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                        <CheckCircle2 className="w-8 h-8" />
                     </div>
                     <div className="space-y-1">
                       <h2 className="text-2xl font-bold tracking-tight text-white">Key Generated</h2>
                       <p className="text-gray-500 text-xs font-medium px-4">Store this secret securely now. For security reasons, it will not be displayed again.</p>
                     </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl flex items-center justify-between group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/[0.02] to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <code className="text-sm font-mono text-white font-bold break-all relative z-10">{generatedKey}</code>
                    <button 
                      onClick={() => copyToClipboard(generatedKey)}
                      className="ml-4 shrink-0 w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-all relative z-10"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3">
                     <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-red-400/80 font-bold uppercase tracking-widest leading-relaxed">
                       Caution: Exposure of this key grants full administrative access to your architectural vault.
                     </p>
                  </div>

                  <button 
                    onClick={() => { setShowCreateModal(false); setGeneratedKey(null); }}
                    className="w-full h-12 bg-[#FF5733] text-black text-[13px] font-bold uppercase tracking-widest rounded-2xl hover:bg-[#ff6c4d] transition-all shadow-[0_0_20px_rgba(255,87,51,0.15)] flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Vault Saved
                  </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
