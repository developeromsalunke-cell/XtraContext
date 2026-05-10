"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut CMD+K or CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Handle Search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-6 py-4 border-b border-gray-700 bg-black">
          <span className="text-gray-500 mr-4 text-lg">🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search threads, projects, or model logs..."
            className="flex-1 bg-transparent border-none text-white placeholder:text-gray-600 focus:outline-none text-base font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded border border-gray-700 text-[10px] text-gray-500 font-mono">ESC</span>
          </div>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-gray-950">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-[-0.125em]" />
            </div>
          ) : query.length > 0 && results.length === 0 ? (
            <div className="p-12 text-center">
               <p className="text-gray-500 text-xs font-mono uppercase tracking-widest font-bold">No architectural matches found.</p>
            </div>
          ) : query.length === 0 ? (
            <div className="p-6">
               <h3 className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest mb-4 px-2">Suggestions</h3>
               <div className="space-y-1">
                  {["Recent Threads", "Team Activity", "API Documentation"].map(item => (
                    <div key={item} className="px-3 py-2.5 rounded-md text-sm text-gray-400 hover:bg-gray-900 hover:text-white cursor-pointer transition-colors flex items-center gap-3">
                       <span className="opacity-50">#</span> {item}
                    </div>
                  ))}
               </div>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {results.map((result) => (
                <div
                  key={result.id}
                  onClick={() => {
                    router.push(`/dashboard/thread/${result.id}`);
                    setIsOpen(false);
                  }}
                  className="px-4 py-3 rounded-lg hover:bg-white hover:text-black group cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">💬</span>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate uppercase tracking-tight">{result.title}</p>
                      <p className="text-[10px] font-mono text-gray-500 group-hover:text-black/60 truncate font-bold uppercase tracking-widest">
                        Model: {result.model || "Unknown"} • {new Date(result.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-gray-600 group-hover:text-black/40 uppercase tracking-widest ml-4 shrink-0">Open &rarr;</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-700 bg-black flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase font-bold tracking-widest">
                 <span className="px-1.5 py-0.5 rounded border border-gray-800 bg-gray-900">↑↓</span>
                 <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-gray-500 uppercase font-bold tracking-widest">
                 <span className="px-1.5 py-0.5 rounded border border-gray-800 bg-gray-900">Enter</span>
                 <span>Select</span>
              </div>
           </div>
           <div className="text-[9px] font-mono text-gray-600 uppercase font-bold tracking-widest">
              XtraContext Search v2.1
           </div>
        </div>
      </div>
    </div>
  );
}
