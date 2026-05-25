"use client";

import { ArrowLeftIcon, CalendarIcon, ClipboardListIcon, UserIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExam } from "@/hooks/use-exams";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return dateFormatter.format(parsed);
}

function getStatusBadgeClassName(status?: string | null) {
  const normalized = status?.toLowerCase() ?? "";
  if (normalized.includes("finalizado"))
    return "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (normalized.includes("andamento"))
    return "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300";
  if (normalized.includes("pendente"))
    return "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300";
  if (normalized.includes("cancelado"))
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300";
  return "border-border bg-muted text-muted-foreground";
}

function DetailField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-8 w-48" />
      </div>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((__, j) => (
              <div key={j} className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const { data: exam, isLoading, isError } = useExam(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (isError || !exam) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Card>
          <CardContent className="flex h-40 items-center justify-center text-muted-foreground">
            Não foi possível carregar os dados do exame.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {exam.ticket ? `Ticket #${exam.ticket}` : `Exame #${exam.id}`}
          </h1>
          {exam.status && (
            <Badge variant="outline" className={getStatusBadgeClassName(exam.status)}>
              {exam.status}
            </Badge>
          )}
        </div>
      </div>

      {/* Dados do Colaborador */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            Dados do Colaborador
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <DetailField label="Nome" value={exam.nomeColaborador} />
          <DetailField label="Tipo de Exame" value={exam.tipoExame} />
          <DetailField label="Solicitante" value={exam.solicitante} />
          <DetailField label="Cidade de Preferência" value={exam.cidadePreferencia} />
        </CardContent>
      </Card>

      {/* Datas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            Datas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <DetailField label="Data da Solicitação" value={formatDate(exam.dataSolicitacao)} />
          <DetailField label="Data do Exame" value={formatDate(exam.dataExame)} />
          <DetailField label="Data de Conclusão" value={formatDate(exam.dataConclusaoDia)} />
          <DetailField label="Última Alteração" value={formatDate(exam.dataUltimaAlteracao)} />
        </CardContent>
      </Card>

      {/* Agendamento e Status */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardListIcon className="h-4 w-4 text-muted-foreground" />
            Agendamento e Formulários
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <DetailField label="Etapa Atual" value={exam.etapaAtual} />
          <DetailField label="SLA de Agendamento" value={exam.statusSlaAgendamento} />
          <DetailField label="Tipo de Solicitação" value={exam.dadosAgendamentoTipoSolicitacao} />
          <DetailField label="Enquadramento PCD" value={exam.agendarEnquadramentoPcd} />
          <DetailField label="Formulário RAC" value={exam.possuiFormularioRac} />
          <DetailField label="Exames Complementares" value={exam.possuiExamesComplementares} />
        </CardContent>
      </Card>
    </div>
  );
}
