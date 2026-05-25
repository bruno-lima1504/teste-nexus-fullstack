import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { BaseGeral } from "@/types/exam";

type ExamTableProps = {
  exams: BaseGeral[];
  isLoading?: boolean;
  onRowClick?: (id: number) => void;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return dateFormatter.format(parsed);
}

function getStatusBadgeClassName(status?: string | null) {
  const normalized = status?.toLowerCase() ?? "";

  if (normalized.includes("finalizado")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300";
  }

  if (normalized.includes("andamento")) {
    return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300";
  }

  if (normalized.includes("pendente")) {
    return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300";
  }

  if (normalized.includes("cancelado")) {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300";
  }

  return "border-border bg-muted text-muted-foreground";
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          {Array.from({ length: 7 }).map((__, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full max-w-[140px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export function ExamTable({ exams, isLoading = false, onRowClick }: ExamTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Nome do Colaborador</TableHead>
            <TableHead>Tipo de Exame</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Etapa Atual</TableHead>
            <TableHead>Data da Solicitação</TableHead>
            <TableHead>Data do Exame</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingRows />
          ) : exams.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground"
              >
                Nenhum exame encontrado para os filtros selecionados.
              </TableCell>
            </TableRow>
          ) : (
            exams.map((exam) => (
              <TableRow
                key={exam.id}
                className="odd:bg-muted/30 cursor-pointer hover:bg-muted/60 transition-colors"
                onClick={() => onRowClick?.(exam.id)}
              >
                <TableCell className="font-medium">
                  {exam.ticket ?? "—"}
                </TableCell>
                <TableCell>{exam.nomeColaborador ?? "—"}</TableCell>
                <TableCell>{exam.tipoExame ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(getStatusBadgeClassName(exam.status))}
                  >
                    {exam.status ?? "—"}
                  </Badge>
                </TableCell>
                <TableCell>{exam.etapaAtual ?? "—"}</TableCell>
                <TableCell>{formatDate(exam.dataSolicitacao)}</TableCell>
                <TableCell>{formatDate(exam.dataExame)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
