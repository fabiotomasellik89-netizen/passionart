"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock } from "lucide-react";
import { adminDemoCredentials } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(adminDemoCredentials.email);
  const [password, setPassword] = useState(adminDemoCredentials.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Credenziali non valide.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-md items-center px-5 py-10">
      <Card className="w-full space-y-6 p-8 text-center">
        <div className="space-y-4">
          <Image
            src="/images/logo.jpeg"
            alt="PassionArt"
            width={96}
            height={96}
            className="mx-auto rounded-[1.75rem]"
          />
          <div className="space-y-2">
            <div className="mx-auto inline-flex rounded-full bg-[var(--color-surface-strong)] p-3">
              <Lock className="h-5 w-5 text-[var(--color-accent)]" />
            </div>
            <h1 className="font-display text-4xl text-[var(--color-foreground)]">
              Accesso admin
            </h1>
            <p className="text-sm leading-7 text-[var(--color-muted)]">
              Credenziali demo già compilate per testare l’area gestionale.
            </p>
          </div>
        </div>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? (
            <div className="rounded-[1.5rem] border border-[var(--color-error)]/20 bg-[rgba(193,79,88,0.08)] px-4 py-3 text-sm text-[var(--color-error)]">
              {error}
            </div>
          ) : null}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Accesso..." : "Entra nel pannello"}
          </Button>
        </form>
      </Card>
    </div>
  );
}