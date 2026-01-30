import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CaddyNavbar } from "@/components/caddy-navbar";
import { Button } from "@/components/ui/button";

const backdropImage =
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1800&q=80";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b10] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${backdropImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.2),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.18),_transparent_45%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black" />
      </div>

      <div className="relative z-10">
        <CaddyNavbar />

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-20 pt-6 lg:pt-12">
          <div className="flex flex-col items-start gap-10">
            <div className="space-y-7">
              <div className="space-y-5 animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Never miss another deadline.
                </h1>
                <p className="text-base text-white/70 sm:text-lg">
                  Drop in PDFs, LMS announcements, emails, or screenshots. Caddy
                  extracts dates, policies, and assignments with citations, then
                  builds an auditable calendar and task plan you can approve
                  before anything changes.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <Button asChild className="bg-white text-black hover:bg-white/90">
                  <Link href="/auth/sign-up">
                    Build my plan
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <section
            id="sample"
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-10"
          >
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Sample syllabus summary
                </p>
                <h2 className="font-display text-3xl font-semibold">
                  Everything from the syllabus, organized into a single clean
                  view.
                </h2>
                <p className="text-sm text-white/70">
                  Students get deadlines, policies, and weekly priorities in one
                  place with audit-ready citations. This is what appears right
                  after a PDF is processed.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/50 p-6">
                <div className="space-y-3 border-b border-white/10 pb-4">
                  <div className="text-sm text-white/60">Course</div>
                  <div className="text-xl font-semibold">BIO 214 · Systems</div>
                  <div className="text-xs text-white/50">
                    Instructor: Dr. Lena Park · Office hours Tue 2–4pm
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                      Upcoming deadlines
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span>Lab report 3</span>
                        <span className="text-white/60">Feb 6 · 5:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span>Problem set 4</span>
                        <span className="text-white/60">Feb 11 · 11:59 PM</span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        <span>Midterm exam</span>
                        <span className="text-white/60">Feb 18 · 9:00 AM</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                      Policies
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-white/70">
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        Late work accepted up to 48 hours with 10% penalty.
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                        Attendance required; two excused absences per term.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/40 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                    Export destinations
                  </div>
                  <p className="mt-2 text-sm text-white/70">
                    One approval pushes everything into calendars and notes.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-black">
                      G
                    </span>
                    Google Calendar
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white">
                      N
                    </span>
                    Notion
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0a6dff] text-[10px] font-semibold text-white">
                      O
                    </span>
                    Outlook
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
