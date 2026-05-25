export type BaseGeral = {
  id: number;
  ticket?: number | null;
  solicitante?: string | null;
  dataSolicitacao?: string | null;
  etapaAtual?: string | null;
  status?: string | null;
  nomeColaborador?: string | null;
  tipoExame?: string | null;
  dataExame?: string | null;
  cidadePreferencia?: string | null;
  agendarEnquadramentoPcd?: string | null;
  possuiFormularioRac?: string | null;
  possuiExamesComplementares?: string | null;
  dataConclusaoDia?: string | null;
  statusSlaAgendamento?: string | null;
  dataUltimaAlteracao?: string | null;
  dadosAgendamentoTipoSolicitacao?: string | null;
};

export type ExamFilters = {
  nomeColaborador?: string;
  ticket?: string;
  tipoExame?: string;
  status?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ExamQueryParams = ExamFilters & {
  page: number;
  limit: number;
};
