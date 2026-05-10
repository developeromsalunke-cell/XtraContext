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
          <h2 className="text-xl font-medium text-gray-400 mb-2">Build Your Universal Memory</h2>
          <p className="text-sm text-gray-600 uppercase tracking-[0.2em] font-mono font-bold">The architectural layer for AI engineering</p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="md:w-1/2 bg-gray-900 flex items-center justify-center p-12">
        <div className="w-full max-w-sm space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-gray-400 text-sm">Start capturing your AI memory today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Designation (Full Name)</label>
              <input
                required
                type="text"
                placeholder="JOHN DOE"
                className="input-noir w-full"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Email Address</label>
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
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-mono">Secret Access Code (Password)</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                className="input-noir w-full"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="btn-primary-noir w-full uppercase tracking-[0.2em] text-xs"
            >
              {loading ? "INITIALIZING..." : "Initialize Vault"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link href="/login" className="text-white font-bold hover:underline">
              Sign In
            </Link>
          </p>
          
          <p className="text-[10px] text-center text-gray-600 uppercase tracking-widest font-mono leading-relaxed">
            By signing up, you agree to our Terms of Service <br /> and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
