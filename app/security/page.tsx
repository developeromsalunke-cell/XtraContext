import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Server } from "lucide-react";

export default function SecurityPage() {
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
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-6">Security <span className="text-[#FF5733]">Architecture</span></h1>
            <p className="text-xl text-gray-400">Enterprise-grade protection for your architectural memory.</p>
          </div>

          <div className="space-y-12">
            <div className="p-8 rounded-2xl bg-[#111] border border-white/[0.05]">
              <ShieldCheck className="w-8 h-8 text-[#FF5733] mb-4" />
              <h2 className="text-2xl font-bold mb-4">Zero Trust Access</h2>
              <p className="text-gray-400 leading-relaxed">
                All requests made to the XtraContext MCP Server require strict API Key authentication. Keys are scoped exclusively to your isolated workspace and can be revoked instantly from the dashboard. We employ a zero-trust model internally, meaning your data is inaccessible without explicit authorization.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#111] border border-white/[0.05]">
              <Lock className="w-8 h-8 text-[#FF5733] mb-4" />
              <h2 className="text-2xl font-bold mb-4">Encryption at Rest & Transit</h2>
              <p className="text-gray-400 leading-relaxed">
                All architectural logs, thought processes, and vector embeddings are encrypted at rest using AES-256 encryption. Data in transit is secured via TLS 1.3, ensuring that man-in-the-middle attacks are structurally impossible when your AI IDE communicates with our servers.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#111] border border-white/[0.05]">
              <Server className="w-8 h-8 text-[#FF5733] mb-4" />
              <h2 className="text-2xl font-bold mb-4">Data Isolation (VPC)</h2>
              <p className="text-gray-400 leading-relaxed">
                For Enterprise customers, XtraContext offers fully isolated Virtual Private Cloud (VPC) deployments. This guarantees that your proprietary code decisions and database schemas never mingle in a multi-tenant environment, satisfying stringent compliance requirements.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
