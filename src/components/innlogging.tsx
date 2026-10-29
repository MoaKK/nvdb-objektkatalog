"use client";

import { LogIn, LogOut, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function Innlogging() {
  const { data: sesjon, isPending } = authClient.useSession();

  if (isPending) return <Skeleton className="h-8 w-28" />;

  if (!sesjon) {
    return (
      <Button
        variant="outline"
        size="sm"
        title="Logg inn med Google. Bare for administratorer."
        onClick={() =>
          authClient.signIn.social({
            provider: "google",
            callbackURL: window.location.pathname,
            errorCallbackURL: "/innlogging-avvist",
          })
        }
      >
        <LogIn />
        <span className="hidden sm:inline">Logg inn som admin</span>
        <span className="sr-only sm:hidden">Logg inn som admin</span>
      </Button>
    );
  }

  return (
    <span className="flex items-center gap-2">
      <Badge variant="secondary" title="Du er innlogget som administrator">
        <ShieldCheck data-icon="inline-start" />
        Admin
      </Badge>
      <span
        className="hidden max-w-48 truncate text-sm text-muted-foreground md:inline"
        title={sesjon.user.email}
      >
        {sesjon.user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        title="Logg ut"
        onClick={() => authClient.signOut()}
      >
        <LogOut />
        <span className="hidden sm:inline">Logg ut</span>
        <span className="sr-only sm:hidden">Logg ut</span>
      </Button>
    </span>
  );
}
