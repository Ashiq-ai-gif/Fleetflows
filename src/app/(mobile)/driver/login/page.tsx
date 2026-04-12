"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Car, Loader2, ArrowRight } from "lucide-react";

export default function DriverLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ phone: "", password: "" }); // password = license for MVP

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: form.phone,
        password: form.password,
        type: "DRIVER",
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Try your phone and license number/1234.");
      } else {
        router.push("/driver"); // Redirect to Driver Dashboard
        router.refresh(); // Ensure layout recalculates session
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#080810] min-h-screen">
      {/* Branding Header */}
      <div className="pt-20 pb-10 flex flex-col items-center">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/50 mb-6">
          <Car className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight text-center">Driver Hub</h1>
        <p className="text-slate-400 font-medium mt-2 text-center text-[15px]">Welcome back. Sign in to see your trips.</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-end pb-8">
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm font-bold text-slate-400 block mb-2 px-1">Phone Number</label>
            <input
              type="tel"
              required
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="Enter your phone number"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white placeholder:text-slate-600 text-[17px] focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-medium"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-400 block mb-2 px-1">PIN / License</label>
            <input
              type="password"
              inputMode="numeric"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Enter your PIN or License"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-white placeholder:text-slate-600 text-[17px] focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all font-medium tracking-[0.2em]"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
            <p className="text-sm font-semibold text-rose-300">{error}</p>
          </div>
        )}

        {/* Huge Mobile Button */}
        <button
          type="submit"
          disabled={loading || !form.phone || !form.password}
          className="w-full h-16 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 rounded-3xl text-white font-black text-[17px] flex items-center justify-center gap-2 shadow-2xl shadow-violet-900/40 disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] transition-all"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Sign In To Drive <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
