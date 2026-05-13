"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Mail, MapPin, Building2, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would hit an API endpoint
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FF5733]/30 font-sans relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#FF5733]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/[0.05] px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Home</span>
          </Link>
          <span className="text-xl font-bold tracking-tight text-white uppercase leading-none">XTRACONTEXT</span>
        </div>
      </nav>

      <main className="pt-32 pb-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left Column: Text & Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
                Let's Build <br/>
                <span className="text-[#FF5733]">The Future.</span>
              </h1>
              <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                Whether you're looking for enterprise licensing, custom MCP tool development, or simply have a technical question, our engineers are ready to assist.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#FF5733]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Email Us</h3>
                  <p className="text-gray-400">xtrafusion.offical@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-[#FF5733]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Enterprise Sales</h3>
                  <p className="text-gray-400">Dedicated support engineering</p>
                  <p className="text-gray-400">Custom SLAs and VPC deployments</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#FF5733]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">Headquarters</h3>
                  <p className="text-gray-400">Pune, India</p>
                  <p className="text-gray-400">100% Online / Remote</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <div className="bg-[#111] border border-white/[0.05] rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5733]/5 blur-[80px] rounded-full pointer-events-none" />
              
              {isSubmitted ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-[#FF5733]/10 border border-[#FF5733]/30 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#FF5733]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">Message Sent</h2>
                  <p className="text-gray-400 max-w-sm">
                    Thank you for reaching out. A member of our team will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="mt-8 text-sm font-bold text-[#FF5733] hover:text-white transition-colors"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Name</label>
                      <input 
                        required
                        type="text" 
                        id="name"
                        className="w-full bg-[#0A0A0A] border border-white/[0.05] focus:border-[#FF5733]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF5733]/50 transition-all"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Work Email</label>
                      <input 
                        required
                        type="email" 
                        id="email"
                        className="w-full bg-[#0A0A0A] border border-white/[0.05] focus:border-[#FF5733]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF5733]/50 transition-all"
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subject</label>
                    <select 
                      id="subject"
                      className="w-full bg-[#0A0A0A] border border-white/[0.05] focus:border-[#FF5733]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-[#FF5733]/50 transition-all appearance-none"
                    >
                      <option value="enterprise">Enterprise Licensing</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnerships</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Message</label>
                    <textarea 
                      required
                      id="message"
                      rows={5}
                      className="w-full bg-[#0A0A0A] border border-white/[0.05] focus:border-[#FF5733]/50 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#FF5733]/50 transition-all resize-none"
                      placeholder="How can we help you..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-[#FF5733] hover:bg-[#ff6c4d] text-black font-bold uppercase tracking-widest rounded-xl py-4 flex items-center justify-center gap-3 transition-colors mt-4"
                  >
                    SEND TRANSMISSION
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
