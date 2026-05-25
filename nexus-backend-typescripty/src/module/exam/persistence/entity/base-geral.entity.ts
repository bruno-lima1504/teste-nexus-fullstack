import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'base_geral', schema: 'central_teste' })
export class BaseGeral {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: true })
  ticket?: string;

  @Column({ nullable: true })
  solicitante?: string;

  @Column({ name: 'data_solicitacao', type: 'date', nullable: true })
  dataSolicitacao?: string;

  @Column({ name: 'etapa_atual', nullable: true })
  etapaAtual?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ name: 'nome_colaborador', nullable: true })
  nomeColaborador?: string;

  @Column({ name: 'tipo_exame', nullable: true })
  tipoExame?: string;

  @Column({ name: 'data_exame', type: 'date', nullable: true })
  dataExame?: string;

  @Column({ name: 'unidade_preferencial', nullable: true })
  unidadePreferencial?: string;

  @Column({ name: 'agendamento_encaminhamento_aso', nullable: true })
  agendamentoEncaminhamentoAso?: string;

  @Column({ name: 'possui_formulario_aso', nullable: true })
  possuiFormularioAso?: string;

  @Column({ name: 'possui_exames_complementares', nullable: true })
  possuiExamesComplementares?: string;

  @Column({ name: 'data_conclusao_dia', type: 'date', nullable: true })
  dataConclusaoDia?: string;

  @Column({ name: 'status_da_agendamento', nullable: true })
  statusDaAgendamento?: string;

  @Column({ name: 'data_ultima_alteracao', type: 'date', nullable: true })
  dataUltimaAlteracao?: string;

  @Column({ name: 'status_agendamento_tipo_solicitacao', nullable: true })
  statusAgendamentoTipoSolicitacao?: string;
}
