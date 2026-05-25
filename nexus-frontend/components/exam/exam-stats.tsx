import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BaseGeral } from "@/types/exam";

type ExamStatsProps = {
  exams: BaseGeral[];
  total: number;
  isLoading?: boolean;
};

function isFinalizado(status?: string | null) {
  return status?.toLowerCase().includes("finalizado") ?? false;
}

function isEmAndamento(status?: string | null) {
  return status?.toLowerCase().includes("andamento") ?? false;
}

export function ExamStats({ exams, total, isLoading = false }: ExamStatsProps) {
  const emAndamentoCount = exams.filter((exam) =>
    isEmAndamento(exam.status),
  ).length;
  const finalizadosCount = exams.filter((exam) =>
    isFinalizado(exam.status),
  ).length;

  const stats = [
    {
      title: "Total de Exames",
      value: total,
      description: "Registros no resultado filtrado",
    },
    {
      title: "Em Andamento",
      value: emAndamentoCount,
      description: "Contagem aproximada da página atual",
    },
    {
      title: "Finalizados",
      value: finalizadosCount,
      description: "Contagem aproximada da página atual",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader>
            <CardDescription>{stat.title}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">
              {isLoading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                stat.value.toLocaleString("pt-BR")
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
