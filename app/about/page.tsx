import React from "react";
import Link from "next/link";
import { ArrowLeft, UserCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30 font-sans relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center overflow-hidden">
               <img src="/xtracontext.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white uppercase leading-none">
              <span className="text-[#FF5733]">XTRA</span>CONTEXT
            </span>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="w-16 h-1 bg-[#FF5733] mb-8" />
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-6">About <span className="text-[#FF5733]">Us</span></h1>
            <p className="text-xl text-gray-400">Pioneering the utility model for AI context infrastructure.</p>
          </div>

          <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
            <p>
              The era of transient AI is over. For years, developers have relied on AI assistants that are brilliant in the moment, but suffer from complete amnesia the second a chat window closes. This led to repetitive prompting, broken code architecture, and lost engineering velocity.
            </p>
            <p>
              <strong>XtraContext was built to solve this.</strong>
            </p>
            <p>
              We believe that as AI agents become more autonomous, their limiting factor won't be intelligence—it will be memory. By leveraging the Model Context Protocol (MCP), we provide a seamless, secure, and permanent architectural vault that integrates directly into your existing toolchain.
            </p>

            <div className="mt-16 p-8 rounded-2xl bg-[#111] border border-white/[0.05] flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-[#FF5733]/10 border border-[#FF5733]/30 flex items-center justify-center shrink-0">
                <UserCircle2 className="w-12 h-12 text-[#FF5733]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Om Salunke</h3>
                <p className="text-[#FF5733] font-bold text-sm tracking-widest uppercase mb-4">Founder & Lead Architect</p>
                <p className="text-gray-400 text-sm">
                  Om Salunke founded XtraContext with a singular vision: to bridge the gap between ephemeral AI outputs and long-term enterprise software architecture. His work focuses on building sovereign memory pipelines that allow development teams to scale their AI usage without losing control of their codebase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
