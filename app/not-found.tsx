"use client";

import React from "react";
import Link from "next/link";
import { MoveLeft, Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF5733]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/[0.05] mb-4">
          <Ghost className="w-12 h-12 text-[#FF5733]" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight">
          Lost In <br/>
          <span className="text-[#FF5733]">Context.</span>
        </h1>
        
        <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
          The architectural record you're looking for doesn't exist in this vault. It may have been revoked or moved to a different workspace.
        </p>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-[#FF5733] text-black font-bold uppercase tracking-widest hover:bg-[#ff6c4d] hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,87,51,0.2)]"
          >
            <MoveLeft className="w-4 h-4" />
            RETURN TO BASE
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-0 w-full text-center">
        <div className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.4em]">Error Code: 404_CONTEXT_NOT_FOUND</div>
      </div>
    </div>
  );
}
