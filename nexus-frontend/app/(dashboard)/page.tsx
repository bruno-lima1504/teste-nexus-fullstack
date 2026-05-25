"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ExamFilters } from "@/components/exam/exam-filters";
import { ExamStats } from "@/components/exam/exam-stats";
import { ExamTable } from "@/components/exam/exam-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useExams } from "@/hooks/use-exams";
import type { ExamFilters as ExamFiltersState } from "@/types/exam";

const PAGE_LIMIT = 10;

export default function DashboardPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<ExamFiltersState>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useExams({
    ...filters,
    page,
    limit: PAGE_LIMIT,
  });

  const exams = data?.data ?? [];
  const meta = data?.meta ?? {
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
  };

  function handleApplyFilters(nextFilters: ExamFiltersState) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handleClearFilters() {
    setFilters({});
    setPage(1);
  }

  const canGoPrevious = page > 1;
  const canGoNext = page < meta.totalPages;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Exames — Base Geral
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Consulte solicitações, acompanhe status e filtre exames ocupacionais
          em tempo real.
        </p>
      </div>

      <ExamStats
        exams={exams}
        total={meta.total}
        isLoading={isLoading || isFetching}
      />

      <ExamFilters
        values={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <ExamTable
        exams={exams}
        isLoading={isLoading || isFetching}
        onRowClick={(id) => router.push(`/exam/${id}`)}
      />

      {meta.totalPages > 0 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink
                href="#"
                size="default"
                className="gap-1 px-2.5 sm:pl-2.5"
                aria-disabled={!canGoPrevious}
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoPrevious) {
                    setPage((current) => current - 1);
                  }
                }}
              >
                <ChevronLeftIcon />
                <span>Anterior</span>
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" isActive size="default">
                {page}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                href="#"
                size="default"
                className="gap-1 px-2.5 sm:pr-2.5"
                aria-disabled={!canGoNext}
                onClick={(event) => {
                  event.preventDefault();
                  if (canGoNext) {
                    setPage((current) => current + 1);
                  }
                }}
              >
                <span>Próxima</span>
                <ChevronRightIcon />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
}
