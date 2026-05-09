"use client";

import { useState } from "react";

interface SearchResult {
  conversation: {
    id: string;
    title: string;
    platform: string;
    model: string;
    createdAt: string;
  };
  matches: Array<{
    id: string;
    role: string;
    content: string;
    createdAt: string;
  }>;
}

export default function MemorySearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // In a real app, we'd fetch from /api/v1/search
      // For now, let's simulate a delay and some results
      await new Promise(r => setTimeout(r, 800));
      
      const mockResults: SearchResult[] = [
        {
          conversation: {
            id: "conv_1",
            title: "OAuth2 implementation",
            platform: "CHATGPT",
            model: "GPT_4",
            createdAt: new Date().toISOString(),
          },
          matches: [
            {
              id: "msg_1",
              role: "ASSISTANT",
              content: "To implement OAuth2 in FastAPI, you should use the `OAuth2PasswordBearer` class...",
              createdAt: new Date().toISOString(),
            }
          ]
        }
      ];
      setResults(mockResults);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/50 to-brand-secondary/50 rounded-2xl opacity-20 group-focus-within:opacity-100 blur-xl transition-all duration-500" />
        <div className="relative flex items-center glass rounded-2xl border border-white/10 overflow-hidden px-4 py-2">
          <svg className={`w-6 h-6 ${isSearching ? 'text-brand-primary animate-spin' : 'text-foreground/40'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isSearching ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            )}
          </svg>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your AI memory semantically..." 
            className="flex-1 px-4 py-3 bg-transparent text-lg focus:outline-none placeholder:text-foreground/20"
          />
          <button 
            type="submit"
            className="px-6 py-2 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-6">
        {results.length > 0 ? (
          results.map((res) => (
            <div key={res.conversation.id} className="glass rounded-3xl border border-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-primary">#{res.conversation.title}</span>
                  <span className="text-[10px] font-mono text-foreground/40 bg-white/5 px-2 py-0.5 rounded">{res.conversation.platform}</span>
                </div>
                <span className="text-xs text-foreground/40">{new Date(res.conversation.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="p-6 space-y-4">
                {res.matches.map((match) => (
                  <div key={match.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${match.role === 'ASSISTANT' ? 'text-brand-secondary' : 'text-foreground/60'}`}>
                        {match.role}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5 text-sm text-foreground/80 leading-relaxed font-mono">
                      {match.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : query && !isSearching ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-foreground/40">No memories found for "{query}". Try a different query.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
