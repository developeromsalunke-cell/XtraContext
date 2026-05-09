"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-6 font-sans">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

      <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">ContextVault</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-foreground/40 text-sm">Start capturing your AI memory today.</p>
        </div>

        <div className="glass p-8 rounded-[32px] border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="John Doe"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all text-sm"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Email Address</label>
              <input
                required
                type="email"
                placeholder="name@company.com"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all text-sm"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-brand-primary transition-all text-sm"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-[10px] text-foreground/40 ml-1">Must be at least 8 characters long.</p>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl bg-brand-primary text-white font-bold hover:bg-brand-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-brand-primary/20"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/40">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-primary font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-foreground/20 max-w-xs mx-auto">
          By signing up, you agree to our Terms of Service and Privacy Policy. Built with precision for AI engineers.
        </p>
      </div>
    </div>
  );
}
