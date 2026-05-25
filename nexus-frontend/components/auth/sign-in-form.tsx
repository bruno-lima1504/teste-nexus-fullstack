"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .max(254, "E-mail deve ter no máximo 254 caracteres")
    .email("Informe um e-mail válido"),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(60, "A senha deve ter no máximo 60 caracteres"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

function SignInFormContent() {
  const searchParams = useSearchParams();
  const signIn = useSignIn();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      toast.success("Conta criada com sucesso. Faça login para continuar.");
    }
  }, [searchParams]);

  async function onSubmit(values: SignInFormValues) {
    try {
      await signIn.mutateAsync(values);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Não foi possível entrar. Tente novamente.";

      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  maxLength={254}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  maxLength={60}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={signIn.isPending}
        >
          {signIn.isPending ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </Form>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={null}>
      <SignInFormContent />
    </Suspense>
  );
}
