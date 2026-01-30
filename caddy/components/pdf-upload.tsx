"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ParsedDeadline = {
  id?: string;
  title: string;
  due_at: string | null;
  details?: string | null;
};

type ParsedPolicy = {
  id?: string;
  policy_type: string;
  text: string;
};

type ParsedTextbook = {
  id?: string;
  title: string;
  author?: string | null;
  isbn?: string | null;
};

type ParseResponse = {
  documentId: string;
  deadlines: ParsedDeadline[];
  policies: ParsedPolicy[];
  textbooks: ParsedTextbook[];
};

export function PdfUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParseResponse | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Failed to parse PDF";
        try {
          const payload = (await response.json()) as { error?: string; detail?: string };
          if (payload?.detail) {
            message = `${payload.error ?? "Parse error"}: ${payload.detail}`;
          } else if (payload?.error) {
            message = payload.error;
          }
        } catch {
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }

      const data = (await response.json()) as ParseResponse;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Upload a PDF</h2>
          <p className="text-sm text-white/70">
            We&apos;ll extract deadlines, policies, and textbook requirements
            into structured tables.
          </p>
        </div>

        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-8 text-center text-sm text-white/70 transition",
            file ? "border-white/40" : "hover:border-white/40",
          )}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              setFile(selected);
              setResult(null);
            }}
          />
          <span className="text-white">{file ? file.name : "Choose a PDF"}</span>
          <span className="text-xs text-white/50">
            Max size ~10MB. Only PDF files.
          </span>
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-white text-black hover:bg-white/90"
          disabled={!file || isLoading}
        >
          {isLoading ? "Parsing..." : "Parse syllabus"}
        </Button>
      </form>

      {result && (
        <div className="mt-6 space-y-5 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70">
            Parsed {result.deadlines.length} deadlines, {result.policies.length} policies, and{" "}
            {result.textbooks.length} textbooks.
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <CategoryCard title="Deadlines">
              {result.deadlines.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  {result.deadlines.slice(0, 6).map((deadline, index) => (
                    <div
                      key={`${deadline.title}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="font-medium text-white/90">
                        {deadline.title}
                      </span>
                      <span className="text-white/60">
                        {deadline.due_at
                          ? new Date(deadline.due_at).toLocaleDateString()
                          : "Needs review"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CategoryCard>

            <CategoryCard title="Policies">
              {result.policies.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  {result.policies.slice(0, 6).map((policy, index) => (
                    <div
                      key={`${policy.policy_type}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        {policy.policy_type}
                      </div>
                      <p className="mt-2 text-sm text-white/80">{policy.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </CategoryCard>

            <CategoryCard title="Textbooks">
              {result.textbooks.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="space-y-2">
                  {result.textbooks.slice(0, 4).map((book, index) => (
                    <div
                      key={`${book.title}-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="font-medium text-white/90">
                        {book.title}
                      </div>
                      {book.author && (
                        <div className="text-xs text-white/60">{book.author}</div>
                      )}
                      {book.isbn && (
                        <div className="text-xs text-white/50">ISBN {book.isbn}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CategoryCard>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CategoryCard title="Needs review">
              <div className="space-y-2 text-white/70">
                {result.deadlines.some((deadline) => !deadline.due_at) ? (
                  result.deadlines
                    .filter((deadline) => !deadline.due_at)
                    .slice(0, 6)
                    .map((deadline, index) => (
                      <div
                        key={`${deadline.title}-review-${index}`}
                        className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3"
                      >
                        {deadline.title}
                      </div>
                    ))
                ) : (
                  <EmptyState label="No missing dates found." />
                )}
              </div>
            </CategoryCard>

            <CategoryCard title="Next action">
              <div className="space-y-3 text-white/70">
                <p>
                  Approve these items to create calendar events and task reminders.
                </p>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/60">
                  We keep a citation trail for every extracted line.
                </div>
              </div>
            </CategoryCard>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-2xl backdrop-blur">
      <div className="text-xs uppercase tracking-[0.25em] text-white/40">
        {title}
      </div>
      <div className="mt-4 text-sm">{children}</div>
    </div>
  );
}

function EmptyState({ label = "No items found yet." }: { label?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center text-xs text-white/50">
      {label}
    </div>
  );
}
