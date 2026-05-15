import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-6">Terms of <span className="text-[#FF5733]">Service</span></h1>
            <p className="text-xl text-gray-400">Effective Date: May 2026</p>
          </div>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <p>
              Welcome to XtraContext. By accessing or using our platform, Model Context Protocol (MCP) servers, or website, you agree to be bound by these Terms of Service.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Acceptance of Terms</h2>
            <p>
              These Terms constitute a legally binding agreement between you and XtraContext. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. API and MCP Usage</h2>
            <p>
              You are responsible for keeping your API keys secure. Any action taken by an AI agent authenticated with your API key is considered your action. You agree not to abuse the MCP server limits, attempt to reverse engineer the semantic search algorithms, or inject malicious payloads into the vault.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Intellectual Property</h2>
            <p>
              The code, architectural thoughts, and text logged into your vault remain entirely your intellectual property. The XtraContext dashboard, MCP schemas, and underlying backend architecture remain the intellectual property of XtraContext.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Limitation of Liability</h2>
            <p>
              XtraContext provides infrastructure "as is" without warranty of any kind. We are not liable for decisions made by your AI agents, code written by your AI agents, or business losses resulting from the use of our memory vaults.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we determine violates these Terms or is harmful to other users of us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
