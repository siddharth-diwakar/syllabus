import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CaddyNavbar } from "@/components/caddy-navbar";
import { Demo } from "@/components/demo";
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
          <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="space-y-7">
              <div className="space-y-5 animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  Campus Ops Agent for students who want zero surprises.
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
                <Button
                  asChild
                  variant="ghost"
                  className="border border-white/15 text-white hover:bg-white/10"
                >
                  <Link href="/auth/login">See a sample workflow</Link>
                </Button>
              </div>

            </div>

            <div className="rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
              <div className="dark">
                <Demo />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
