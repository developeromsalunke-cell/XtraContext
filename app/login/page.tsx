"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Left Section - Branding */}
      <div className="md:w-1/2 bg-black border-r border-gray-700 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden blueprint-grid">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-4 mb-10 group">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded transition-transform group-hover:rotate-6">
              <span className="text-black font-black text-2xl font-heading">X</span>
            </div>
            <span className="text-4xl font-heading font-black tracking-tight uppercase">XtraContext</span>
          </Link>
          <h2 className="text-xl font-medium text-gray-400 mb-2">Your AI's Long-Term Memory</h2>
          <p className="text-sm text-gray-600 uppercase tracking-[0.2em] font-mono font-bold">Never lose context between AI conversations</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="md:w-1/2 bg-gray-900 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to access your memory vault.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Email</label>
              <input
                required
                type="email"
                placeholder="NAME@ENGINEER.COM"
                className="input-noir w-full"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Password</label>
                <Link href="#" className="text-[10px] text-gray-500 hover:text-white transition-colors underline">Forgot?</Link>
              </div>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="input-noir w-full"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400">
               <input type="checkbox" className="w-3 h-3 bg-gray-800 border-gray-600 rounded focus:ring-white" />
               <span>Remember me for 30 days</span>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="btn-primary-noir w-full uppercase tracking-[0.2em] text-xs"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="space-y-6">
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-700"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-600 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-700"></div>
            </div>

            <div className="space-y-3">
               <button className="btn-secondary-noir w-full text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <span>🔑</span> Continue with GitHub
               </button>
               <button className="btn-secondary-noir w-full text-xs uppercase tracking-widest flex items-center justify-center gap-3">
                  <span>🔑</span> Continue with Google
               </button>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
