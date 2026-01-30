import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_ITEMS = 25;
const SUMMARY_LIMIT = 180;
const monthRegex =
  /(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}(,?\s+\d{4})?/i;
const numericRegex = /\b\d{1,2}[\/\-]\d{1,2}([\/\-]\d{2,4})?\b/;
const isbnRegex = /\b(?:97[89][\- ]?)?\d{9}[\- ]?\d\b/;

function toLines(text: string) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseDate(line: string): string | null {
  const now = new Date();
  const numericMatch = line.match(numericRegex);
  if (numericMatch) {
    const value = numericMatch[0].replace(/-/g, "/");
    const parts = value.split("/").map((part) => part.trim());
    if (parts.length === 2) {
      const withYear = `${parts[0]}/${parts[1]}/${now.getFullYear()}`;
      const parsed = Date.parse(withYear);
      return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
    }
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
  }

  const monthMatch = line.match(monthRegex);
  if (monthMatch) {
    const chunk = monthMatch[0];
    const hasYear = /\d{4}/.test(chunk);
    const value = hasYear ? chunk : `${chunk} ${now.getFullYear()}`;
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? null : new Date(parsed).toISOString();
  }

  return null;
}

function cleanTitle(line: string) {
  const dateMatch = line.match(monthRegex) ?? line.match(numericRegex);
  let cleaned = dateMatch ? line.replace(dateMatch[0], "") : line;
  cleaned = cleaned.replace(/[\-\u2013\u2014|,]+/g, " ").replace(/\s+/g, " ");
  cleaned = cleaned.replace(/\b(due|deadline|exam|midterm|final)\b[:\s-]*/i, "");
  cleaned = cleaned.trim();
  return cleaned.length ? cleaned : line;
}

function summarizeLine(line: string, limit = SUMMARY_LIMIT) {
  const sentence = line.split(/(?<=[.!?])\s/)[0] ?? line;
  const trimmed = sentence.trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit - 1)}…`;
}

function inferPolicyType(line: string) {
  const lower = line.toLowerCase();
  if (lower.includes("late")) return "late policy";
  if (lower.includes("attendance")) return "attendance";
  if (lower.includes("grading") || lower.includes("grade")) return "grading";
  if (lower.includes("exam")) return "exam policy";
  if (lower.includes("collaboration")) return "collaboration";
  if (lower.includes("integrity") || lower.includes("honor"))
    return "academic integrity";
  return "general";
}

function extractDeadlines(lines: string[]) {
  const keywords = [
    "deadline",
    "due",
    "exam",
    "midterm",
    "final",
    "quiz",
    "assignment",
    "project",
  ];

  return lines
    .filter((line) =>
      keywords.some((keyword) => line.toLowerCase().includes(keyword)),
    )
    .map((line) => ({
      title: summarizeLine(cleanTitle(line), 120),
      due_at: parseDate(line),
      details: null as string | null,
      source_text: line,
    }))
    .slice(0, MAX_ITEMS);
}

function extractPolicies(lines: string[]) {
  const keywords = [
    "policy",
    "late",
    "attendance",
    "grading",
    "exam",
    "collaboration",
    "academic integrity",
  ];

  return lines
    .filter((line) =>
      keywords.some((keyword) => line.toLowerCase().includes(keyword)),
    )
    .map((line) => ({
      policy_type: inferPolicyType(line),
      text: summarizeLine(line, SUMMARY_LIMIT),
      source_text: line,
    }))
    .slice(0, MAX_ITEMS);
}

function extractTextbooks(lines: string[]) {
  const keywords = ["textbook", "required", "isbn", "reading", "materials"];

  return lines
    .filter((line) =>
      keywords.some((keyword) => line.toLowerCase().includes(keyword)),
    )
    .map((line) => ({
      title: summarizeLine(line, SUMMARY_LIMIT),
      author: line.toLowerCase().includes(" by ")
        ? line.split(/\s+by\s+/i)[1]?.trim() ?? null
        : null,
      isbn: line.match(isbnRegex)?.[0] ?? null,
      notes: null as string | null,
      source_text: line,
    }))
    .slice(0, MAX_ITEMS);
}

export async function POST(request: Request) {
  const { PDFParse } = await import("pdf-parse");
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  if (!file.type.includes("pdf")) {
    return NextResponse.json(
      { error: "Only PDF files are supported" },
      { status: 400 },
    );
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File too large. Please upload a PDF under 10MB." },
      { status: 413 },
    );
  }

  let text = "";
  try {
    const { PDFParse } = await import("pdf-parse");
    const workerModule = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    (globalThis as { pdfjsWorker?: unknown }).pdfjsWorker = workerModule;
    const buffer = Buffer.from(await file.arrayBuffer());
    PDFParse.setWorker("pdfjs-dist/legacy/build/pdf.worker.mjs");
    const parser = new PDFParse({ data: buffer, disableWorker: true });
    const parsed = await parser.getText();
    text = parsed.text ?? "";
    await parser.destroy();
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to parse PDF";
    console.error("PDF parse failed:", err);
    return NextResponse.json(
      { error: "Failed to parse PDF", detail: message },
      { status: 422 },
    );
  }

  if (!text.trim()) {
    return NextResponse.json(
      { error: "No readable text found in PDF" },
      { status: 422 },
    );
  }

  const lines = toLines(text);
  const deadlines = extractDeadlines(lines);
  const policies = extractPolicies(lines);
  const textbooks = extractTextbooks(lines);

  const { data: documentRow, error: documentError } = await supabase
    .from("documents")
    .insert({
      user_id: authData.claims.sub,
      filename: file.name,
      content_type: file.type,
      raw_text: text,
    })
    .select("id")
    .single();

  if (documentError || !documentRow) {
    return NextResponse.json(
      { error: documentError?.message ?? "Failed to save document" },
      { status: 500 },
    );
  }

  const documentId = documentRow.id as string;

  if (deadlines.length) {
    await supabase.from("deadlines").insert(
      deadlines.map((deadline) => ({
        document_id: documentId,
        user_id: authData.claims.sub,
        title: deadline.title,
        due_at: deadline.due_at,
        details: deadline.details,
        source_text: deadline.source_text,
      })),
    );
  }

  if (policies.length) {
    await supabase.from("policies").insert(
      policies.map((policy) => ({
        document_id: documentId,
        user_id: authData.claims.sub,
        policy_type: policy.policy_type,
        text: policy.text,
        source_text: policy.source_text,
      })),
    );
  }

  if (textbooks.length) {
    await supabase.from("textbooks").insert(
      textbooks.map((textbook) => ({
        document_id: documentId,
        user_id: authData.claims.sub,
        title: textbook.title,
        author: textbook.author,
        isbn: textbook.isbn,
        notes: textbook.notes,
        source_text: textbook.source_text,
      })),
    );
  }

  return NextResponse.json({
    documentId,
    deadlines,
    policies,
    textbooks,
  });
}
