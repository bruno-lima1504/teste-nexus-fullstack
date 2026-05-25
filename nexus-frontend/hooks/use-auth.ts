"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

import { api } from "@/lib/api";
import { getToken, isAuthenticated, removeToken, setToken } from "@/lib/auth";
import type {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  UserProfile,
} from "@/types/auth";

export function useSignIn() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInRequest) =>
      api<SignInResponse>("/auth/sign-in", {
        method: "POST",
        body: data,
        auth: false,
      }),
    onSuccess: (data) => {
      setToken(data.accessToken);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      router.push("/");
    },
  });
}

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignUpRequest) =>
      api<void>("/user/register", {
        method: "POST",
        body: data,
        auth: false,
      }),
    onSuccess: () => {
      router.push("/sign-in?registered=true");
    },
  });
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => api<UserProfile>("/auth/profile", { method: "GET" }),
    enabled: Boolean(getToken()),
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(() => {
    removeToken();
    queryClient.clear();
    router.push("/sign-in");
  }, [queryClient, router]);
}

export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/sign-in");
    }
  }, [router]);
}
