import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { Sparkles, UserRound } from "lucide-react";

export async function CaddyNavbar() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <nav className="w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-xl font-semibold tracking-tight text-white">
            caddy
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {!user && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
            >
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          )}
          {user ? (
            <LogoutButton
              size="sm"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              label="Sign out"
            />
          ) : (
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href={user ? "/protected" : "/auth/login"}>
              <UserRound className="h-4 w-4" />
              Profile
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
