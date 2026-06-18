import { useRef, useState } from "react";
import { AlertCircle, CheckCircle2, FileText, Loader2, Plug, Sparkles, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { cn } from "@/lib/utils";
import { dealProfile, type Field } from "@/data/mock";

function ConfidenceDot({ c }: { c: Field["confidence"] }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        c === "high" ? "bg-success" : "bg-warning"
      )}
      aria-label={c === "high" ? "High confidence" : "Needs review"}
    />
  );
}

function FieldRow({ f }: { f: Field }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <ConfidenceDot c={f.confidence} />
          {f.label}
        </div>
        <div className="text-sm mt-0.5 font-medium">{f.value}</div>
      </div>
      {f.confidence === "review" && (
        <Badge variant="outline" className="border-warning/40 text-warning bg-warning/10 text-[10px] font-semibold uppercase">
          Review
        </Badge>
      )}
    </div>
  );
}

export default function Projects() {
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPick = (f: File | null) => {
    if (!f) return;
    setFile(f);
    setRevealed(false);
  };

  const extract = () => {
    if (!file) return;
    setExtracting(true);
    setRevealed(false);
    setTimeout(() => {
      setExtracting(false);
      setRevealed(true);
    }, 1500);
  };

  const formatSize = (b: number) =>
    b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`;

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 space-y-10">
      <PageHeader
        eyebrow="Setup · 01"
        title="New project"
        italic="intake."
        description="Upload the signed contract. PreKick extracts the deal profile and lines up the discovery calls it needs to make."
      />

      <section className="rounded-2xl border border-border bg-card p-6 md:p-7 shadow-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <label className="text-sm font-semibold flex items-center gap-2">
            <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-3.5 w-3.5 text-primary" />
            </span>
            Upload signed SOW / MSA
          </label>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground rounded-full border border-dashed border-border px-2.5 py-1">
            <Plug className="h-3 w-3" />
            CRM sync — coming soon
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        {!file ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              onPick(e.dataTransfer.files?.[0] ?? null);
            }}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "mt-4 cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition-all",
              dragOver
                ? "border-primary/60 bg-primary/5"
                : "border-border bg-muted/20 hover:border-primary/30 hover:bg-muted/40"
            )}
          >
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Upload className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm font-medium">Drop the signed contract here</div>
            <div className="text-xs text-muted-foreground mt-1">or click to browse · PDF, DOCX, TXT</div>
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">{file.name}</div>
              <div className="text-[11px] text-muted-foreground">{formatSize(file.size)}</div>
            </div>
            <button
              onClick={() => { setFile(null); setRevealed(false); }}
              className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
            Once CRM is connected, signed contracts land here automatically.
          </span>
          <Button onClick={extract} disabled={!file || extracting} className="gap-2 bg-gradient-brand hover:opacity-95 shadow-brand border-0">
            {extracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {extracting ? "Extracting…" : "Extract Deal Profile"}
          </Button>
        </div>
      </section>


      {revealed && (
        <section className="animate-fade-up rounded-2xl border border-border bg-card shadow-elevated overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-gradient-to-r from-accent/40 to-transparent">
            <div>
              <div className="eyebrow text-primary mb-1.5">Output · 02</div>
              <h2 className="font-display text-2xl tracking-tight">Deal Profile</h2>
              <p className="text-xs text-muted-foreground mt-1">Extracted from SOW · 2 fields flagged for review</p>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" />High confidence</span>
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-warning" />Needs review</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="p-5 md:p-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Customer</h3>
              {dealProfile.customer.map((f) => <FieldRow key={f.label} f={f} />)}
            </div>
            <div className="p-5 md:p-6">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Commercial</h3>
              {dealProfile.commercial.map((f) => <FieldRow key={f.label} f={f} />)}
            </div>
          </div>

          <div className="p-5 md:p-6 border-t border-border">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Scope</h3>
            <div className="text-sm font-medium">{dealProfile.scope.summary}</div>
            <ul className="mt-3 grid sm:grid-cols-2 gap-2">
              {dealProfile.scope.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span><span className="font-medium text-foreground">Start:</span> {dealProfile.scope.startDate}</span>
              <span><span className="font-medium text-foreground">Go-live:</span> {dealProfile.scope.goLive}</span>
            </div>
          </div>

          <div className="p-5 md:p-6 border-t border-border bg-muted/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-primary" />
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Required documents <span className="text-foreground/60 normal-case font-normal">— auto-derived from EU + Enterprise</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {dealProfile.compliance.map((c) => (
                <span
                  key={c.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground border border-primary/15 px-3 py-1 text-xs font-medium"
                  title={c.reason}
                >
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
