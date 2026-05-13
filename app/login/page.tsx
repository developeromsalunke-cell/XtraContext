"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A0A0A] text-white font-sans selection:bg-[#FF5733]/30">
      {/* Left Section - Branding */}
      <div className="md:w-[45%] bg-[#080808] border-r border-white/[0.06] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5733]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <Link href="/" className="inline-flex items-center gap-4 mb-10 group">
            <div className="w-12 h-12 bg-[#FF5733] flex items-center justify-center rounded-xl shadow-[0_0_20px_rgba(255,87,51,0.3)] transition-transform group-hover:scale-105 group-hover:rotate-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 9v1" />
                <path d="M12 14v1" />
                <path d="M15 12h-1" />
                <path d="M10 12H9" />
              </svg>
            </div>
            <span className="text-4xl font-heading font-black tracking-tight uppercase">XtraContext</span>
          </Link>
          <h2 className="text-xl font-medium text-gray-300 mb-3">Your AI's Long-Term Memory</h2>
          <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-mono font-bold border border-white/10 bg-white/5 px-4 py-1.5 rounded-full">
            Never lose context
          </p>
        </div>
        
        {/* Decorative Grid Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#FF5733]/5 to-transparent border-t border-white/[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Right Section - Form */}
      <div className="md:w-[55%] flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full max-w-md space-y-10 relative z-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-white">Welcome Back</h1>
            <p className="text-gray-400 text-sm font-medium">Sign in to access your secure memory vault.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative">
                <input
                  required
                  type="email"
                  placeholder="name@engineer.com"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF5733] focus:ring-1 focus:ring-[#FF5733] transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-[10px] font-bold text-[#FF5733] hover:text-[#ff6c4d] transition-colors uppercase tracking-wider">Forgot?</Link>
              </div>
              <div className="relative">
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#FF5733] focus:ring-1 focus:ring-[#FF5733] transition-all tracking-[0.2em]"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
               <div className="relative flex items-center">
                 <input type="checkbox" id="remember" className="peer w-4 h-4 appearance-none bg-[#111] border border-white/10 rounded checked:bg-[#FF5733] checked:border-[#FF5733] transition-all cursor-pointer" />
                 <svg className="absolute w-3 h-3 pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 text-black" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
               </div>
               <label htmlFor="remember" className="text-xs font-medium text-gray-400 cursor-pointer select-none">Remember me for 30 days</label>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#FF5733] hover:bg-[#ff6c4d] text-black font-black uppercase text-xs tracking-[0.2em] py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="space-y-6 pt-4">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#0A0A0A] px-2">or continue with</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
                <div className="grid grid-cols-2 gap-4">
               <button className="w-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub
               </button>
               <button className="w-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-white text-[11px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer">
                   <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google
               </button>
            </div>          </div>
          </div>

          <p className="text-center text-sm text-gray-500 pt-6">
            New to the platform?{" "}
            <Link href="/signup" className="text-white font-bold hover:text-[#FF5733] transition-colors underline decoration-white/30 underline-offset-4">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
