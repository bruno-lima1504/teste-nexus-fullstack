"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
  BaseGeral,
  ExamQueryParams,
  PaginatedResult,
} from "@/types/exam";

function buildQueryString(params: ExamQueryParams): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
}

export function useExam(id: number) {
  return useQuery({
    queryKey: ["exam", id],
    queryFn: () => api<BaseGeral>(`/exam/base-geral/${id}`),
  });
}

export function useExams(params: ExamQueryParams) {
  return useQuery({
    queryKey: ["exams", params],
    queryFn: () => {
      const queryString = buildQueryString(params);
      const path = `/exam/base-geral${queryString ? `?${queryString}` : ""}`;
      return api<PaginatedResult<BaseGeral>>(path);
    },
  });
}
