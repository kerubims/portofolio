"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.push("/admin");
    else setError((await res.json()).error || "Login failed");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <form onSubmit={submit} className="w-full max-w-sm bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-foreground mb-1">Portfolio Admin</h1>
        <p className="text-sm text-secondary mb-5 font-body">Masukkan password untuk mengelola project.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="w-full px-3 py-2 rounded-lg border border-outline-variant bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          disabled={busy || !password}
          className="mt-4 w-full py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Checking..." : "Login"}
        </button>
      </form>
    </main>
  );
}
