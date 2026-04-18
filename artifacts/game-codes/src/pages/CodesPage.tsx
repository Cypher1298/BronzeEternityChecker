import codesData from "@/data/codes.json";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, CheckCheck, Clock, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface GameCode {
  code: string;
  expiration: number;
  requirements: string[];
  rewards: string[];
}

const codes: GameCode[] = codesData as GameCode[];

function formatExpiration(unixTs: number): string {
  const date = new Date(unixTs * 1000);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function isExpired(unixTs: number): boolean {
  return Date.now() > unixTs * 1000;
}

function expiresIn(unixTs: number): string {
  const diff = unixTs * 1000 - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) return `Expires in ${days}d ${hours}h`;
  return `Expires in ${hours}h`;
}

function CodeCard({ entry }: { entry: GameCode }) {
  const [copied, setCopied] = useState(false);
  const expired = isExpired(entry.expiration);

  function handleCopy() {
    navigator.clipboard.writeText(entry.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 border-2 ${
        expired
          ? "border-border opacity-60 grayscale-[40%]"
          : "border-primary/30 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/10"
      }`}
    >
      {expired && (
        <div className="absolute inset-0 bg-background/40 z-10 flex items-center justify-center pointer-events-none">
          <span className="rotate-[-20deg] text-4xl font-black text-destructive/40 border-4 border-destructive/30 px-4 py-1 rounded-sm tracking-widest select-none">
            EXPIRED
          </span>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-lg text-primary tracking-wide">
              {entry.code}
            </span>
            <button
              onClick={handleCopy}
              disabled={expired}
              title="Copy code"
              className="text-muted-foreground hover:text-primary transition-colors disabled:cursor-not-allowed"
            >
              {copied ? (
                <CheckCheck className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={expired ? "destructive" : "default"}
              className="text-xs font-semibold"
            >
              {expired ? "Expired" : "Active"}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {expired
                ? `Expired ${formatExpiration(entry.expiration)}`
                : expiresIn(entry.expiration)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <span className="font-medium">Expiration:</span>
          <span>{formatExpiration(entry.expiration)}</span>
        </div>

        {entry.requirements.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold">Requirements</span>
            </div>
            <ul className="space-y-0.5 pl-1">
              {entry.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-base">🎁</span>
            <span className="text-sm font-semibold">Rewards</span>
          </div>
          <ul className="space-y-0.5 pl-1">
            {entry.rewards.map((reward) => (
              <li key={reward} className="flex items-start gap-2 text-sm text-foreground">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {reward}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CodesPage() {
  const active = codes.filter((c) => !isExpired(c.expiration));
  const expired = codes.filter((c) => isExpired(c.expiration));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Bronze Eternity Codes</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {active.length} active &middot; {expired.length} expired
            </p>
          </div>
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full font-mono">
            Updated live
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
        {active.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">
              Active Codes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {active.map((entry) => (
                <CodeCard key={entry.code} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {expired.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Expired Codes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {expired.map((entry) => (
                <CodeCard key={entry.code} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {codes.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">No codes yet</p>
            <p className="text-sm mt-1">Add codes to the JSON file to get started.</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
        Expiration is checked automatically in real-time
      </footer>
    </div>
  );
}
