import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
            <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-6">Privacy <span className="text-[#FF5733]">Policy</span></h1>
            <p className="text-xl text-gray-400">Effective Date: May 2026</p>
          </div>

          <div className="space-y-8 text-gray-400 leading-relaxed">
            <p>
              At XtraContext, protecting your proprietary data and architectural memory is our highest priority. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform and MCP tools.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and authentication credentials.</li>
              <li><strong>Telemetry Data:</strong> Token usage, model identifiers (e.g., GPT-4, Claude 3.5 Sonnet), and platform metadata.</li>
              <li><strong>Vault Contents:</strong> Architectural logs, code snippets, and metadata actively pushed to our MCP server by your authenticated AI agents.</li>
            </ul>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. How We Use Your Data</h2>
            <p>
              We use your data strictly to provide and improve the XtraContext service. Your vault contents are never used to train generalized AI models. They are isolated, encrypted, and accessible only by you and the AI agents you explicitly authorize via API keys.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Data Retention</h2>
            <p>
              You retain full ownership of your architectural memory. You can export or delete your entire vault from the dashboard at any time. Upon deletion, all related data is purged from our active databases and vector stores within 30 days.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Third-Party Sharing</h2>
            <p>
              We do not sell, rent, or trade your data. We only share information with trusted infrastructure partners (e.g., AWS, CockroachLabs) strictly for the purpose of hosting and securing the platform, under strict confidentiality agreements.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy, please contact our data protection team at <strong>privacy@xtracontext.com</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
