"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";

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

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyLabel) return;
    setCreating(true);
    try {
      const res = await fetch("/api/v1/keys", {
        method: "POST",
        body: JSON.stringify({ label: newKeyLabel }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.key);
        await fetchKeys();
      }
    } catch (error) {
      console.error("Failed to create key", error);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/v1/keys?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchKeys();
      }
    } catch (error) {
      console.error("Failed to revoke key", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-5xl mx-auto w-full">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tighter uppercase mb-4">API Keys</h1>
                <p className="text-gray-500 text-[11px] font-mono font-bold tracking-widest uppercase">Secure access tokens for AI agents and MCP servers</p>
              </div>

              <button
                onClick={() => { setGeneratedKey(null); setNewKeyLabel(""); setShowCreateModal(true); }}
                className="h-11 px-8 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
              >
                Generate New Key
              </button>
            </header>

            <div className="space-y-6">
               {loading ? (
                 Array(3).fill(0).map((_, i) => (
                   <div key={i} className="h-24 rounded-lg bg-gray-900 border border-gray-700 animate-pulse" />
                 ))
               ) : keys.length === 0 ? (
                 <div className="py-32 text-center border border-dashed border-gray-700 rounded-lg">
                    <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest font-bold">No active API keys identified.</p>
                 </div>
               ) : (
                 <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="border-b border-gray-700 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                         <th className="px-8 py-5">Label</th>
                         <th className="px-8 py-5">Prefix</th>
                         <th className="px-8 py-5">Created</th>
                         <th className="px-8 py-5 text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800">
                       {keys.map((key) => (
                         <tr key={key.id} className="group hover:bg-black transition-colors">
                           <td className="px-8 py-5">
                             <div className="font-bold text-sm text-white uppercase tracking-tight">{key.label}</div>
                           </td>
                           <td className="px-8 py-5">
                             <div className="font-mono text-xs text-gray-400">cv_{key.prefix}...</div>
                           </td>
                           <td className="px-8 py-5 text-gray-400 text-xs font-medium">
                             {new Date(key.createdAt).toLocaleDateString()}
                           </td>
                           <td className="px-8 py-5 text-right">
                             <button 
                               onClick={() => handleRevokeKey(key.id)}
                               className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white border border-gray-700 hover:border-white px-3 py-1.5 rounded transition-all"
                             >
                               Revoke
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
            </div>

            <div className="mt-16 card-noir border-gray-800 bg-gray-900">
               <h3 className="text-xl font-bold uppercase tracking-tight mb-4">Security Protocol</h3>
               <p className="text-gray-400 text-sm leading-relaxed max-w-2xl font-medium">
                  API keys provide administrative access to your XtraContext vault. Never share these keys or expose them in client-side code. Use these tokens specifically for configuring Model Context Protocol (MCP) servers or background synchronization nodes.
               </p>
            </div>
          </div>
        </main>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="w-full max-w-md card-noir bg-gray-900 border-gray-700 p-10 space-y-8 animate-in fade-in zoom-in duration-200">
              {!generatedKey ? (
                <>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold uppercase tracking-tight">Generate Key</h2>
                    <p className="text-gray-400 text-sm font-medium">Provide a label to identify this access token.</p>
                  </div>

                  <form onSubmit={handleCreateKey} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Key Label</label>
                        <input
                          autoFocus
                          required
                          type="text"
                          placeholder="E.G. CLAUDE DESKTOP"
                          className="input-noir w-full uppercase font-mono text-xs"
                          value={newKeyLabel}
                          onChange={(e) => setNewKeyLabel(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button 
                          type="button"
                          onClick={() => setShowCreateModal(false)}
                          className="flex-1 h-12 border border-gray-700 text-white text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={creating}
                          type="submit"
                          className="flex-1 h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {creating ? "Generating..." : "Generate"}
                        </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Key Generated</h2>
                    <p className="text-gray-400 text-sm font-medium">Copy this secret now. It will not be shown again.</p>
                  </div>

                  <div className="p-6 bg-black border border-white/20 rounded-lg flex items-center justify-between group">
                    <code className="text-xs font-mono text-white font-bold break-all">{generatedKey}</code>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(generatedKey); alert("Copied!"); }}
                      className="ml-4 shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                    >
                      Copy
                    </button>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400 font-bold uppercase tracking-widest text-center">
                    Warning: Compromised keys provide full access to your vault.
                  </div>

                  <button 
                    onClick={() => { setShowCreateModal(false); setGeneratedKey(null); }}
                    className="w-full h-12 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-200 transition-colors"
                  >
                    I have saved the key
                  </button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
