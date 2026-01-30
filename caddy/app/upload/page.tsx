import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CaddyNavbar } from "@/components/caddy-navbar";
import { Demo } from "@/components/demo";

export default async function UploadPage() {
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
              Upload your syllabus
            </h1>
            <p className="text-sm text-white/70">
              Drop PDFs, LMS announcements, or screenshots. We will extract dates
              and tasks with citations before anything is created.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-black/40 p-4 shadow-2xl backdrop-blur">
            <div className="dark">
              <Demo />
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}
