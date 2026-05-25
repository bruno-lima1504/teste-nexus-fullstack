"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAuthGuard, useLogout, useProfile } from "@/hooks/use-auth";
import { isAuthenticated } from "@/lib/auth";

function getInitials(email?: string) {
  if (!email) {
    return "NX";
  }

  const localPart = email.split("@")[0] ?? email;
  return localPart.slice(0, 2).toUpperCase();
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthGuard();
  const { data: profile } = useProfile();
  const logout = useLogout();

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="space-y-0.5">
            <p className="font-display text-xl font-semibold tracking-tight">
              Nexus
            </p>
            <p className="text-xs text-muted-foreground">
              Gestão de exames ocupacionais
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Avatar>
                <AvatarFallback>{getInitials(profile?.email)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Conta</span>
                  <span className="truncate text-sm font-medium">
                    {profile?.email ?? "Carregando..."}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={logout}>
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Separator />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
