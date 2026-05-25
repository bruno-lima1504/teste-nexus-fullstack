"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExamFilters } from "@/types/exam";

const TIPO_EXAME_OPTIONS = [
  "Admissional",
  "Periódico",
  "Demissional",
  "Retorno ao Trabalho",
  "Mudança de Função",
] as const;

const STATUS_OPTIONS = [
  "Finalizado no SOC/GED",
  "Em andamento",
  "Pendente",
  "Cancelado",
] as const;

type ExamFiltersProps = {
  values: ExamFilters;
  onApply: (filters: ExamFilters) => void;
  onClear: () => void;
};

export function ExamFilters({ values, onApply, onClear }: ExamFiltersProps) {
  const [draft, setDraft] = useState<ExamFilters>(values);

  useEffect(() => {
    setDraft(values);
  }, [values]);

  function updateDraft(field: keyof ExamFilters, value: string) {
    setDraft((current) => ({
      ...current,
      [field]: value || undefined,
    }));
  }

  function handleClear() {
    setDraft({});
    onClear();
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="nomeColaborador">Nome do colaborador</Label>
          <Input
            id="nomeColaborador"
            placeholder="Buscar por nome"
            value={draft.nomeColaborador ?? ""}
            onChange={(event) =>
              updateDraft("nomeColaborador", event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ticket">Ticket</Label>
          <Input
            id="ticket"
            placeholder="Número do ticket"
            value={draft.ticket ?? ""}
            onChange={(event) => updateDraft("ticket", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipoExame">Tipo de exame</Label>
          <Select
            value={draft.tipoExame ?? ""}
            onValueChange={(value) =>
              updateDraft("tipoExame", value === "all" ? "" : value)
            }
          >
            <SelectTrigger id="tipoExame" className="w-full">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {TIPO_EXAME_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={draft.status ?? ""}
            onValueChange={(value) =>
              updateDraft("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={() => onApply(draft)}>
          Aplicar filtros
        </Button>
        <Button type="button" variant="outline" onClick={handleClear}>
          Limpar
        </Button>
      </div>
    </div>
  );
}
