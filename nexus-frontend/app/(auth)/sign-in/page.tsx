import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Nexus
        </p>
        <h1 className="font-heading text-4xl font-light tracking-tight text-foreground">
          Entrar
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Acesse sua conta para continuar.
        </p>
      </header>

      <div className="rounded-2xl border border-border/60 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
        <SignInForm />
      </div>
    </div>
  );
}
