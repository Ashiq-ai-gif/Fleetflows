"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, X, Loader2 } from "lucide-react";

export default function ImpersonationBanner() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [exiting, setExiting] = useState(false);

  const user = session?.user as any;
  if (!user?.isImpersonating) return null;

  const handleExit = async () => {
    setExiting(true);
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exit: true }),
      });
      const data = await res.json();
      if (data.sessionUpdate) {
        await updateSession(data.sessionUpdate);
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setExiting(false);
    }
  };

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold">
        <ShieldCheck className="w-4 h-4" />
        <span>
          You are viewing as <span className="font-black text-amber-300">{user.tenantName}</span>
        </span>
      </div>
      <button
        onClick={handleExit}
        disabled={exiting}
        className="flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white bg-amber-500/20 hover:bg-amber-500/40 px-3 py-1.5 rounded-lg transition-all"
      >
        {exiting ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
        Exit to Super Admin
      </button>
    </div>
  );
}
