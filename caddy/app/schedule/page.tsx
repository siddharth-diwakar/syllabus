import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaddyNavbar } from "@/components/caddy-navbar";
import { Button } from "@/components/ui/button";

export default async function SchedulePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <main className="min-h-screen bg-[#0b0b10] text-white">
      <div className="relative">
        <CaddyNavbar />
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-16 pt-6">
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-semibold">
              Your schedule summary
            </h1>
            <p className="text-sm text-white/70">
              A clean view of what is due, plus quick answers to policy
              questions.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur">
              <div className="space-y-3 border-b border-white/10 pb-4">
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Upcoming deadlines
                </div>
                <div className="text-sm text-white/60">
                  Week of Feb 3 – Feb 9
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-medium">Lab report 3</div>
                    <div className="text-xs text-white/50">BIO 214</div>
                  </div>
                  <span className="text-white/60">Feb 6 · 5:00 PM</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-medium">Problem set 4</div>
                    <div className="text-xs text-white/50">Calculus II</div>
                  </div>
                  <span className="text-white/60">Feb 7 · 11:59 PM</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <div className="font-medium">Midterm exam</div>
                    <div className="text-xs text-white/50">BIO 214</div>
                  </div>
                  <span className="text-white/60">Feb 9 · 9:00 AM</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur">
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Policy quick check
                </div>
                <div className="mt-3 space-y-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Late work accepted up to 48 hours with 10% penalty.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    Collaboration allowed on labs with attribution.
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur">
                <div className="text-xs uppercase tracking-[0.25em] text-white/40">
                  Ask about a policy
                </div>
                <p className="mt-2 text-sm text-white/70">
                  Example: “What is the late policy for lab reports?”
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Ask a question..."
                  />
                  <Button className="w-full bg-white text-black hover:bg-white/90">
                    Ask Caddy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
