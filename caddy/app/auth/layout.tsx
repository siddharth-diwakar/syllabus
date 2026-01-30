import type { ReactNode } from "react";
import { CaddyNavbar } from "@/components/caddy-navbar";

const backdropImage =
  "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1800&q=80";

export default function AuthLayout({ children }: { children: ReactNode }) {
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
        <section className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-12">
          <div className="dark w-full max-w-md">{children}</div>
        </section>
      </div>
    </main>
  );
}
